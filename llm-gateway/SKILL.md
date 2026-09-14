---
name: llm-gateway
description: Run and drive the Claude LLM Gateway, a local proxy on http://localhost:8765 that lets Claude Code (or any app speaking the Anthropic messages API) run on other models via OpenRouter: DeepSeek, GPT, Gemini, Llama, Mistral, Groq, local Ollama and 440 more. Use when the user wants to start, stop or check the gateway, point Claude Code at a cheaper or different model, compare models, see which providers are healthy, or says "start the gateway", "run claude on deepseek", "use the llm gateway", "switch claude code to gpt", "open the gateway dashboard", "which models are up".
---

# LLM Gateway: run Claude Code on any model

Installed at `C:\LLMGateway` (upstream: github.com/chenxingqiang/claude-code-open,
npm `claude-llm-gateway`, MIT). It is an Express server that accepts Anthropic
`/v1/messages` calls on port 8765 and forwards them to OpenRouter's unified
endpoint, picking a model by task type (coding, chat, analysis, creative,
translation, summary) or using the one it is told. It also trims `max_tokens`
per provider so reasoning models do not return empty answers.

## Start, stop, status

```bash
cmd //c "C:\LLMGateway\run.cmd"      # starts minimised, opens the dashboard
cmd //c "C:\LLMGateway\stop.cmd"     # kills whatever is listening on 8765
curl -s http://localhost:8765/health  # {"status":"healthy","providers":{...}}
```

Or the CLI directly from `C:\LLMGateway`:

```bash
node bin/cli.js start --port 8765     # foreground
node bin/cli.js status
node bin/cli.js models status|sync|list [--provider deepseek]
node bin/cli.js test --model deepseek/deepseek-chat
```

Always check `/health` before telling the user it is running. If port 8765 is
already taken, run `stop.cmd` first rather than picking a new port; other
tooling assumes 8765.

## Keys: the one step only Byron can do

The gateway needs `OPENROUTER_API_KEY` in `C:\LLMGateway\.env` (copied from
`env.example` on install, still holding placeholders). Without it, provider
health will show 16 of 36 "healthy" but every real completion will fail.

Do not paste or type keys yourself. Tell him to either:
- open the dashboard at http://localhost:8765, Config tab, and paste it there; or
- edit `C:\LLMGateway\.env` and set `OPENROUTER_API_KEY=` then restart.

The gateway does no auth of its own (the `GATEWAY_API_KEY` in `.env` is not
enforced by the server). Keep it bound to localhost, never expose port 8765
to the network or the VPS, or anyone who finds it spends his OpenRouter credit.

## Pointing Claude Code at it

Only in a fresh terminal, only for that session, never in his global settings:

```bash
export ANTHROPIC_BASE_URL=http://localhost:8765
export ANTHROPIC_API_KEY=local-gateway   # any non-empty value, the gateway ignores it
claude
```

Claude Code then sends its normal requests and the gateway answers from
whichever model it maps `claude-3-*` names to (see `/models`). To force a
model, set it in the dashboard's Model Selection tab or pass `model` in the
request body as an OpenRouter id, e.g. `deepseek/deepseek-chat`.

Warn him once, in one line, that a non-Claude model behind Claude Code will
be worse at tool use and may break on long agentic runs. It is for cheap or
experimental sessions, not for client work.

## Useful endpoints

| Path | What it gives |
|---|---|
| `/` | Dashboard: config, provider health, model analytics, live logs |
| `/health` | Status, provider counts, uptime |
| `/models` | Claude-name to backend-model mapping |
| `/models/catalog` | Full synced OpenRouter catalog (445 models, refreshed daily) |
| `/providers` | Per-provider health, `POST /providers/:name/test` to probe one |
| `/stats`, `/tokens/stats` | Usage and token-optimisation numbers |

## Reporting back

Byron's style: one line with the outcome (running or not, on which model),
then at most three bullets. If a provider is down, name it and say what it
needs (usually a key). Never paste `.env` contents or any key into chat.
