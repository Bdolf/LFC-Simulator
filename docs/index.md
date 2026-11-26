---
title: Hailer SDK
description: CLI toolkit for Hailer workspace development — scaffold projects, manage workspace configuration as code, and generate TypeScript types.
audience: public
status: stable
tags: [sdk, cli, overview, workspace, infrastructure-as-code]
source: hailer-sdk
generated: false
---

# Hailer SDK

`@hailer/sdk` is the command-line toolkit for developing against a Hailer workspace. It
treats your **workspace configuration as code**: pull workflows, fields, phases, teams,
groups, insights, apps, document templates, and actions into local TypeScript files, edit
them in your editor with full type safety, and push the changes back — version-controlled
and reviewable like any other code.

```bash
npx @hailer/sdk@latest init
```

## What it does

- **Scaffold projects** — [`hailer-sdk init`](./commands/init) creates a typed project,
  authenticates you, and optionally sets up the AI agent and an MCP server for your TUI.
- **AI agent files** — [`hailer-sdk agent-config`](./commands/agent-config) writes the
  instructions, skills, and MCP connection for Claude Code or OpenCode.
- **Project updates** — [`hailer-sdk update-project`](./commands/update-project) brings the
  `package.json` scripts and `hailer.d.ts` up to the installed SDK version.
- **Configuration as code** — [`hailer-sdk ws-config`](./commands/workspace-config) pulls your
  workspace into editable `.ts` files and pushes changes back, with conflict detection so a
  push never silently clobbers a change someone made in the Hailer UI.

## When to reach for the SDK

Use the SDK for **structure and configuration** — creating workflows, editing fields and
phases, managing teams/groups/insights/apps, document templates, and the sandboxed
[actions](./configuration/actions) that automate them. It batches changes, keeps them in
git, and lets you review before applying, and `actions run` test-runs your local action code
in the real sandbox before you push it.

For **data operations** — creating and querying activities — use the Hailer MCP server or
API instead. The SDK is about the shape of the workspace, not the records inside it.

## The pull → edit → push loop

```bash
hailer-sdk ws-config pull          # fetch the workspace into workspace/*.ts
# edit the TypeScript files
hailer-sdk ws-config push          # apply your changes back to Hailer
hailer-sdk ws-config pull          # refresh local state + the sync snapshot
```

Every edit you make lives in a specific file under `workspace/`. What each file controls,
and every property you can set in it, is documented in the
[Configuration reference](./configuration/).

## Next steps

- [Install & initialize a project](./commands/init)
- [Configuration reference](./configuration/) — the editable files and every option in them
- [`ws-config` command & sync model](./commands/workspace-config)
- [Set up the AI agent for your coding tools](./commands/agent-config)
- [Update an existing project](./commands/update-project)
