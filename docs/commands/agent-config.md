---
title: hailer-sdk agent-config
description: Write the AI agent files (AGENTS.md, skills, MCP connection) for your coding tools from the installed SDK version.
audience: public
status: stable
tags: [sdk, cli, agent, skills, mcp, claude, opencode]
source: hailer-sdk
generated: false
---

# `hailer-sdk agent-config`

Write the AI agent files for your coding tools (TUIs) from the installed SDK version.

## Usage

```bash
npm run agent-config
# or
npx hailer-sdk agent-config
```

It also runs as the last step of `npm run sdk-update`, after [`update-project`](./update-project), so every SDK update brings the latest instructions and skills.

## Flags

| Flag | Effect |
|---|---|
| `--claude` / `--opencode` | Set up the AI agent for these coding tools (skips the prompt). Can be combined. |
| `--no-tui` | Skip the AI agent setup for coding tools, only `AGENTS.md` is written (skips the prompt). |
| `--mcp-url <url>` | Full MCP server URL, including any API key or workspace id the server needs. Defaults to the URL already configured. |
| `--verbose` | Detailed logging. |

Without a tool flag, it asks which coding tools you use, so you can switch tools at any time.

## What it Writes

| File | Claude Code | OpenCode | None |
|---|---|---|---|
| `AGENTS.md` (instructions shared by all tools) | yes | yes | yes |
| Skills | `.claude/skills/` | `.opencode/skills/` | no |
| MCP connection | `.mcp.json` | `.opencode/opencode.json` | no |

Before writing, it deletes the files it is about to write, for every tool: `AGENTS.md` and the skills shipped by the SDK. Your own skills and settings stay.

Claude Code reads `AGENTS.md` when the project has no `CLAUDE.md`. An existing `CLAUDE.md` is not touched, but Claude Code then reads it instead of `AGENTS.md`, so `agent-config` warns about it and we recommend removing it.

## MCP Connection

The MCP connection is written as a native HTTP connection:

- **Claude Code** (`.mcp.json`): `hailer: { "type": "http", "url": "<url>" }`
- **OpenCode** (`.opencode/opencode.json`): `mcp.servers.hailer: { "type": "remote", "url": "<url>", "oauth": false }`

Only the `hailer` entry is changed; your other MCP servers and settings stay.

Without `--mcp-url`, the URL already set in `.mcp.json` or `.opencode/opencode.json` is kept, so switching tools keeps the connection. When no URL is found, no MCP connection is written.

## Projects Created With Older SDK Versions

Older projects copied the AI agent files from `@hailer/mcp` in a `postinstall` script. Run [`update-project`](./update-project) first to replace the old scripts, then `agent-config`, which converts the old `npx mcp-remote <url>` MCP entry to a native HTTP connection, keeping the URL.
