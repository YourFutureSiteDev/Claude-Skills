// finished MP4 -> one contact sheet of 30 frames across the whole video, plus
// the 0.6s start grab the hook check reads and an end grab for the end card.
//
//   node contact-sheet.mjs --in path/to/out/<slug>.mp4 [--out path/to/sheet.png]
//
// Three frames (start, middle, end) missed whatever happened between them: a
// card hidden behind the title box, a caption sitting in the app's bottom bar,
// one background held for eight seconds. Thirty tiles on one page show all of
// that at a glance, and the grade reads the page rather than guessing.
//
// Each tile is stamped with the time it was taken from, so a fault on the sheet
// can be looked up in work/<slug>/words.json, and carries a red line and tint
// over the bottom 300px of the frame: TikTok's caption bar and action rail sit
// there, so anything inside the tint is hidden on a phone.
//
// Lands in <project>/work/<slug>/ when the video is in <project>/out/, which is
// where render-brief.mjs leaves it, otherwise beside the video. Prints one JSON
// line on success.

import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';

const TILES = 30; // 6 across, 5 down
const TILE_W = 180;
const TILE_H = 320;
// 300 of 1920 is 50 of 320 at tile size.
const RAIL_Y = TILE_H - Math.round(TILE_H * 300 / 1920);
const HOLD_SECS = 4;

function args(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) out[a.slice(2)] = argv[i + 1]?.startsWith('--') ? true : argv[++i];
  }
  return out;
}

function run(cmd, list) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, list, { stdio: ['ignore', 'pipe', 'pipe'], shell: false });
    let out = '';
    let err = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { err += d; });
    p.on('error', (e) => reject(new Error(`${cmd} could not start: ${e.message}`)));
    p.on('close', (code) => code === 0
      ? resolve(out)
      : reject(new Error(`${cmd} exited ${code}\n${(err || out).slice(-1200)}`)));
  });
}

// drawtext needs a real font file on Windows (this ffmpeg build has no fonts.conf)
// and the cron box is Linux, so try both. No font means no time stamps, not no sheet.
const FONTS = [
  'C:/Windows/Fonts/arialbd.ttf',
  'C:/Windows/Fonts/arial.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
  '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
];

async function main() {
  const a = args(process.argv);
  if (!a.in) {
    console.error('usage: node contact-sheet.mjs --in path/to/<slug>.mp4 [--out path/to/sheet.png]');
    process.exit(2);
  }

  const video = path.resolve(a.in);
  if (!existsSync(video)) throw new Error(`no video at ${video}`);
  const slug = path.basename(video, path.extname(video));
  const dir = path.dirname(video);
  const project = path.basename(dir) === 'out' ? path.dirname(dir) : dir;
  const sheet = path.resolve(a.out || path.join(project, 'work', slug, 'sheet.png'));
  const start = path.join(path.dirname(sheet), 'start.png');
  const end = path.join(path.dirname(sheet), 'end.png');
  await mkdir(path.dirname(sheet), { recursive: true });

  const duration = Number((await run('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video,
  ])).trim());
  if (!(duration > 0)) throw new Error(`ffprobe could not read a duration from ${video}`);

  // Escaped for the filtergraph: a drive colon or a comma inside drawtext's
  // expressions would otherwise end the option early.
  const font = FONTS.find((f) => existsSync(f));
  const fontArg = font ? font.replace(/\\/g, '/').replace(/:/g, '\\:') : null;
  const stamp = fontArg
    ? `,drawtext=fontfile='${fontArg}':fontsize=17:fontcolor=white:box=1:boxcolor=black@0.65:boxborderw=4:x=6:y=6`
      + `:text='%{eif\\:t\\:d}.%{eif\\:mod(floor(t*10)\\,10)\\:d}s'`
    : '';

  // fps=30/duration takes one frame every duration/30 seconds starting at 0,
  // so a 31s video and a 62s video both come out as exactly 30 tiles.
  const vf = [
    `fps=${TILES}/${duration}`,
    `scale=${TILE_W}:${TILE_H}:force_original_aspect_ratio=decrease`,
    `pad=${TILE_W}:${TILE_H}:(ow-iw)/2:(oh-ih)/2`,
    `drawbox=x=0:y=${RAIL_Y}:w=iw:h=ih-${RAIL_Y}:color=red@0.16:t=fill`,
    `drawbox=x=0:y=${RAIL_Y}:w=iw:h=2:color=red@0.9:t=fill`,
  ].join(',') + stamp + ',tile=6x5:padding=4:margin=4:color=0x202020';

  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-vf', vf, '-frames:v', '1', sheet]);
  // The hook check reads full size, not a tile: 0.6s is where the first word is up.
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '0.6', '-i', video, '-frames:v', '1', start]);
  // The last tile is duration/30 from the end, 2.07s on a 62s video, and the end
  // card only holds for 2.0s, so the sheet alone can miss it.
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-sseof', '-1.2', '-i', video, '-frames:v', '1', end]);

  const spacing = duration / TILES;
  console.log(JSON.stringify({
    sheet,
    start,
    end,
    duration: Number(duration.toFixed(2)),
    tiles: TILES,
    spacing: Number(spacing.toFixed(2)),
    // A shot held past 4s shows as at least this many matching tiles in a row.
    heldIfInARow: Math.floor(HOLD_SECS / spacing) + 2,
    stamped: Boolean(fontArg),
  }));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
