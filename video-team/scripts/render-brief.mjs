// brief.json -> finished vertical MP4, free.
//
//   node render-brief.mjs --brief path/to/brief.json [--engine "<Content Engine root>"]
//
// Narrates the script with edge-tts (free, keyless, and it returns real
// word-level timings rather than estimates), builds the background from
// whatever source the brief names, and burns word-by-word captions in one
// ffmpeg pass.
//
// The heavy lifting is Content Engine's own src/ modules, imported rather than
// reimplemented: they are already tuned for this (ASS subtitles instead of a
// drawtext stack, measured source resolution instead of trusting metadata, a
// moving crop instead of zoompan). Duplicating them here would mean two
// renderers drifting apart.
//
// Exits non-zero with the reason on any failure. Prints one JSON line on
// success.

import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const DEFAULT_ENGINE = 'C:/Users/PC/OneDrive/Desktop/Claude/Content Engine';

// Roughly what edge-tts delivers at rate "+8%". Only used to warn, never to
// time anything — the real timings come back from the WordBoundary events.
const WORDS_PER_SEC = 3.1;

function args(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) out[a.slice(2)] = argv[i + 1]?.startsWith('--') ? true : argv[++i];
  }
  return out;
}

function run(cmd, list, { capture = true } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, list, { stdio: ['ignore', 'pipe', 'pipe'], shell: false });
    let out = '';
    let err = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { err += d; });
    p.on('error', (e) => reject(new Error(`${cmd} could not start: ${e.message}`)));
    p.on('close', (code) => code === 0
      ? resolve(capture ? out : '')
      : reject(new Error(`${cmd} exited ${code}\n${(err || out).slice(-1200)}`)));
  });
}

// buildShotReel's onLog hands over objects, not strings, so template-literalling
// it prints [object Object] and throws away the only progress signal there is.
const say = (m) => console.error(`  reel: ${typeof m === 'string' ? m : JSON.stringify(m)}`);

// python is `py` on this machine; `python` is not always on PATH.
async function python() {
  for (const c of ['py', 'python', 'python3']) {
    try {
      await run(c, ['-c', 'import edge_tts']);
      return c;
    } catch { /* try the next one */ }
  }
  throw new Error('no python with edge_tts installed. Fix: py -m pip install edge-tts');
}

async function main() {
  const a = args(process.argv);
  if (!a.brief) {
    console.error('usage: node render-brief.mjs --brief path/to/brief.json [--engine <Content Engine root>]');
    process.exit(2);
  }

  const engine = (a.engine || DEFAULT_ENGINE).replace(/\\/g, '/');
  if (!existsSync(path.join(engine, 'src/render.js'))) {
    throw new Error(`Content Engine not found at ${engine}. Pass --engine with its real path.`);
  }

  const briefPath = path.resolve(a.brief);
  const brief = JSON.parse(await readFile(briefPath, 'utf8'));

  for (const field of ['slug', 'script', 'background']) {
    if (!brief[field]) throw new Error(`brief.json is missing "${field}"`);
  }

  // The project folder the brief lives in is where the video belongs. Byron's
  // landing rule, and it means the render never has to be told twice.
  const projectDir = path.dirname(briefPath);
  const work = path.join(projectDir, 'work', brief.slug);
  const out = path.resolve(a.out || path.join(projectDir, 'out', `${brief.slug}.mp4`));
  await mkdir(work, { recursive: true });

  // Importing across a path with a space in it: pathToFileURL encodes it
  // correctly, a hand-built file:// string does not.
  const mod = (f) => import(pathToFileURL(path.join(engine, 'src', f)).href);
  const { renderVideo } = await mod('render.js');

  // --- 1. narration -------------------------------------------------------
  const words = brief.script.trim().split(/\s+/).filter(Boolean).length;
  const predicted = words / WORDS_PER_SEC;
  console.error(`script: ${words} words, expect about ${predicted.toFixed(1)}s`);
  if (predicted > 62) {
    console.error(`  warning: over 60s. Retention falls off past this; consider cutting to ~190 words.`);
  }

  const py = await python();
  const audio = path.join(work, 'voice.mp3');
  const wordsPath = path.join(work, 'words.json');

  const tts = await run(py, [
    path.join(engine, 'src/tts.py'),
    brief.script,
    audio,
    wordsPath,
    brief.voice || 'en-US-AvaNeural',
    brief.rate || '+8%',
  ]);
  const ttsInfo = JSON.parse(tts.trim().split('\n').pop());
  const timings = JSON.parse(await readFile(wordsPath, 'utf8'));
  if (!timings.length) throw new Error('edge-tts returned no word timings; captions would be empty');
  const speech = timings[timings.length - 1].end;
  console.error(`voice: ${ttsInfo.voice}, ${timings.length} words, ${speech.toFixed(1)}s of speech`);

  // --- 2. background ------------------------------------------------------
  // Cut to cover the narration with a little slack, so the reel never runs
  // short and has to visibly loop back on itself.
  const targetSecs = speech + 1.5;
  const bg = brief.background;
  let background;

  if (bg.kind === 'file') {
    if (!existsSync(bg.path)) throw new Error(`background file not found: ${bg.path}`);
    if (bg.reel === false) {
      background = bg.path;                       // use as-is; ffmpeg loops it
    } else {
      const { buildShotReel } = await mod('shots.js');
      background = path.join(work, 'reel.mp4');
      await buildShotReel({
        source: bg.path,
        out: background,
        targetSecs,
        ...(bg.shotSecs ? { shotSecs: bg.shotSecs } : {}),
        ...(bg.trimBottom ? { trimBottom: bg.trimBottom } : {}),
        onLog: say,
      });
    }
  } else if (bg.kind === 'youtube') {
    // Licensed-to-circulate footage only: official trailers, press material.
    // Never a ripped scene. Content Engine's PLAN.md settled this.
    const dl = path.join(work, 'source.mp4');
    if (!existsSync(dl)) {
      console.error('  downloading source with yt-dlp');
      await run('yt-dlp', [
        '-f', 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        '--merge-output-format', 'mp4',
        '-o', dl, bg.url,
      ]);
    }
    const { buildShotReel } = await mod('shots.js');
    background = path.join(work, 'reel.mp4');
    await buildShotReel({
      source: dl,
      out: background,
      targetSecs,
      ...(bg.shotSecs ? { shotSecs: bg.shotSecs } : {}),
      ...(bg.trimBottom ? { trimBottom: bg.trimBottom } : {}),
      onLog: say,
    });
  } else if (bg.kind === 'stills') {
    if (!bg.urls?.length) throw new Error('background.kind is "stills" but urls is empty');
    const { buildStillReel } = await mod('stills.js');
    background = path.join(work, 'reel.mp4');
    await buildStillReel({
      urls: bg.urls,
      out: background,
      targetSecs,
      ...(bg.holdSecs ? { holdSecs: bg.holdSecs } : {}),
      workDir: path.join(work, 'stills'),
    });
  } else {
    throw new Error(`unknown background.kind "${bg.kind}". Use file, youtube or stills.`);
  }

  // --- 3. render ----------------------------------------------------------
  //
  // renderVideo has to be handed a RELATIVE output path. It builds the
  // subtitles filter by escaping a Windows drive letter to `C\\:`, which ffmpeg
  // reads as an escaped backslash followed by a bare colon, so the colon ends
  // the filename and starts a new option: "Unable to parse original_size".
  // Content Engine never hits this because make-movie.js passes `out/x.mp4`
  // relative and the drive-letter branch never fires. Reproduce that by
  // running from the output directory and passing the bare filename, rather
  // than editing a module the cron pipeline depends on.
  console.error('rendering');
  await mkdir(path.dirname(out), { recursive: true });
  process.chdir(path.dirname(out));

  const result = await renderVideo({
    audio,
    background,
    words: timings,
    out: path.basename(out),
    ...(brief.font ? { font: brief.font } : {}),
    ...(brief.hashtags ? { hashtags: brief.hashtags } : {}),
    ...(brief.trimBottom ? { trimBottom: brief.trimBottom } : {}),
    ...(brief.endCard ? { endCard: brief.endCard } : {}),
    ...(brief.holdSecs ? { holdSecs: brief.holdSecs } : {}),
  });

  console.log(JSON.stringify({
    ok: true,
    out,                          // absolute; result.out is the basename we passed in
    ass: out.replace(/\.mp4$/, '.ass'),
    duration: Number(result.duration.toFixed(2)),
    words: result.words,
    scriptWords: words,
    voice: ttsInfo.voice,
    background: bg.kind,
  }, null, 2));
}

main().catch((e) => {
  console.error(`\nfailed: ${e.message}`);
  process.exit(1);
});
