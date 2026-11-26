---
title: hailer-sdk update-project
description: Update the project files (package.json scripts, hailer.d.ts, docs/) to the installed SDK version.
audience: public
status: stable
tags: [sdk, cli, update, scripts, types, docs]
source: hailer-sdk
generated: false
---

# `hailer-sdk update-project`

Update the project files to the installed SDK version.

## Usage

```bash
npm run update-project
# or
npx hailer-sdk update-project
```

It also runs as part of `npm run sdk-update`, before [`agent-config`](./agent-config):

```bash
npm install @hailer/sdk@latest && hailer-sdk update-project && hailer-sdk agent-config
```

## Flags

| Flag | Effect |
|---|---|
| `--verbose` | Detailed logging. |

## What it Does

- Copies `hailer.d.ts` from the installed SDK to `workspace/hailer.d.ts`.
- Adds the SDK scripts to `package.json`. A script with the same name as an SDK script gets the SDK value; your own scripts stay.
- Copies the SDK documentation to `docs/`. The files the SDK ships are overwritten; your own files in `docs/` stay.
- Removes the old `postinstall` and `mcp-update` scripts when `postinstall` still copies files from `@hailer/mcp` (projects created with SDK 0.23.0 and below).
