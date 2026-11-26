---
title: hailer-sdk init
description: Initialize a new Hailer project with structure, authentication, AI agent files, and optional MCP server connection.
audience: public
status: stable
tags: [sdk, cli, init, scaffold, project, mcp, authentication, agent]
source: hailer-sdk
generated: false
---

# `hailer-sdk init`

Initialize a new Hailer project with proper structure and configuration.

## Usage

```bash
hailer-sdk init
```

## Flags

`init` is interactive, but any prompt can be pre-answered with a flag (useful for scripting / CI):

| Flag | Effect |
|---|---|
| `--project-name <name>` | Project name (skips the prompt). |
| `--workspace <id>` | Target workspace id (must be one you own or admin). |
| `--user-api-key <key>` | Authenticate with an existing user API key (skips the email/password prompts). |
| `--email <email>` / `--password <pw>` | Credentials used to create a user API key (skips the prompts). |
| `--claude` / `--opencode` | Set up the AI agent for these coding tools (skips the prompt). Can be combined. |
| `--no-tui` | Skip the AI agent setup for coding tools, only `AGENTS.md` is written (skips the prompt). |
| `--mcp` / `--no-mcp` | Connect / don't connect the coding tools to an MCP server (skips the prompt). |
| `--mcp-url <url>` | Connect to this MCP server (implies `--mcp`). The full URL, including any API key or workspace id the server needs. Without it, `--mcp` uses the local Hailer MCP server. |
| `--verbose` | Detailed logging. |

## Description

The `init` command is an interactive wizard that guides you through setting up a new Hailer project. It handles authentication, workspace selection, the AI agent files for your coding tools, the optional MCP server connection, and creates all necessary project files and configurations.

## Interactive Steps

1. **Project name** - Choose a name for your project
2. **API URL** - Select which Hailer API to connect to (cloud or local development)
3. **Email and password** - Used once to create a user API key *(skipped if `--user-api-key` provided)*
4. **Workspace selection** - Choose from the workspaces where you're an owner or admin, or create a new one
5. **Coding tools** - Select the coding tools (TUIs) you use: Claude Code, OpenCode, or none
6. **MCP server** - Optionally connect the selected coding tools to an MCP server *(only asked when a coding tool is selected)*

## Authentication

Every project authenticates with a **user API key**, stored in `.env`:

```
# .env
HAILER_USER_API_KEY="your-api-key"

# config.json
{
  "workspaceId": "...",
  "apiUrl": "...",
  "userApiKey": "HAILER_USER_API_KEY"
}
```

- With `--user-api-key`, that key is used.
- Without it, `init` asks for your email and password and creates a key named `hailer-sdk <project-name>` for the selected workspace. The email and password are not saved.

> A created key expires after one year. Create a new one in Hailer and replace it in `.env`.

Projects created with older SDK versions that store `HAILER_EMAIL`/`HAILER_PASSWORD` keep working.

## AI Agent Files

`init` writes the AI agent files for the selected coding tools (the same as [`agent-config`](./agent-config)):

| File | Claude Code | OpenCode | None |
|---|---|---|---|
| `AGENTS.md` (instructions shared by all tools) | yes | yes | yes |
| Skills | `.claude/skills/` | `.opencode/skills/` | no |
| MCP connection | `.mcp.json` | `.opencode/opencode.json` | no |

## MCP Server (Optional)

The MCP (Model Context Protocol) server lets your coding tools work with your Hailer workspace. The connection is the same for any server, local or remote: a full URL, written to the tool's config as a native HTTP connection.

The default URL points to the **local** Hailer MCP server:

```
http://localhost:3030/api/sdk/mcp?apiKey=<your-api-key>&workspaceId=<workspace-id>
```

With the local server, `init` also adds the `@hailer/mcp` dependency and the `mcp-start` script. Start it before opening your coding tool:

```bash
npm run mcp-start
```

To use another server, give its full URL (with `--mcp-url` or at the prompt), including any API key or workspace id it needs. No local server is set up then.

`.mcp.json` and `.opencode/` are git-ignored, as the URL can hold your API key.

## What it Creates

```
my-project/
├── workspace/           # Workflow configs (generated on `npm run pull`)
│   └── hailer.d.ts      # Type definitions (copied in at init and by `update-project`)
├── docs/                # Copy of SDK documentation
├── AGENTS.md            # AI agent instructions
├── .claude/skills/      # Skills (Claude Code only; git-ignored)
├── .opencode/           # Skills and opencode.json (OpenCode only; git-ignored)
├── .mcp.json            # MCP connection (Claude Code with MCP only; git-ignored)
├── .env                 # User API key (git-ignored)
├── .gitignore           # Excludes .env and other sensitive files
├── config.json          # Workspace configuration
├── package.json         # Node.js project configuration with useful scripts
├── tsconfig.json        # TypeScript configuration
├── vitest.config.ts     # Test runner configuration
└── README.md            # Project documentation
```

### Generated npm scripts

**Workspace Management:**
- `npm run pull` - Pull workflows from Hailer
- `npm run push` - Push all configurations to Hailer
- `npm run workflows-push` - Push only workflow configurations
- `npm run workflows-sync` - Create/delete workflows
- `npm run workflows-covers -- <workflow...>` - Give workflows a random gradient cover image
- `npm run fields-push` - Push only field configurations
- `npm run phases-push` - Push only phase configurations
- `npm run templates-push` - Push only template configurations
- `npm run templates-sync` - Create/delete document templates
- `npm run groups-push` - Push only group configurations
- `npm run teams-push` - Push only team configurations
- `npm run insights-push` - Push only insights configurations
- `npm run apps-push` - Push only app configurations

> Every push/sync script also has a `:force` variant (e.g. `push:force`, `fields-push:force`,
> `workflows-sync:force`) that skips delete confirmations.

**Testing & maintenance:**
- `npm test` / `npm run test:watch` / `npm run test:ui` - Run function-field tests (Vitest)
- `npm run sdk-update` - Update `@hailer/sdk`, then run `update-project` and `agent-config`
- `npm run update-project` - Update the `package.json` scripts and copy `hailer.d.ts`
- `npm run agent-config` - Rewrite the AI agent files, e.g. to switch coding tools

**MCP Server (local MCP only):**
- `npm run mcp-start` - Start the local MCP server

## Next Steps

After initialization:

1. Navigate to your project:
   ```bash
   cd my-project
   npm install
   ```

2. Pull your workspace configuration:
   ```bash
   npm run pull
   ```

3. (Optional) If you use the local MCP server, start it:
   ```bash
   npm run mcp-start
   ```

4. Start developing with type-safe workflow definitions!

## API URL Selection

During initialization, you'll be prompted to select an API URL:

- **Hailer cloud** (`https://api.hailer.com`) - Production Hailer API (default)
- **Hailer local** (`https://api.hailer.local.gd/`) - Local development environment

The selected API URL is saved to `config.json` and used for all subsequent SDK commands.

**For local development:**
- The SDK automatically detects local environments (URL contains "local")
- Self-signed SSL certificates are automatically accepted for local APIs
- Useful for testing changes before deploying to production

## Notes

- The `.env` file contains your API key - **never commit this to version control**
- The generated `.gitignore` excludes `.env`, `.mcp.json`, `.claude/`, and `.opencode/`
- The `apiUrl` field in `config.json` determines which API all commands will use

## Troubleshooting

### API Key Creation Fails

- Check that your email and password are correct
- Create a key in Hailer yourself and run `init` again with `--user-api-key`

### Workspace Creation Fails

If creating a new workspace fails:
- Select an existing workspace instead
- Check your account permissions
- Verify your network connection
