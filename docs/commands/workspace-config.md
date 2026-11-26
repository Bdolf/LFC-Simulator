---
title: hailer-sdk ws-config
description: Pull and push workspace configuration — workflows, fields, phases, templates, teams, groups, insights, apps, and actions — between Hailer and your local repository.
audience: public
status: stable
tags: [sdk, cli, ws-config, workspace, pull, push, sync, snapshot]
source: hailer-sdk
generated: false
---

# `hailer-sdk ws-config`

Manage workspace configuration as code: pull your workspace into local TypeScript files, edit
them, and push the changes back.

**Alias:** `workspace-config`

This page documents the **commands** and the **sync model**. For what you can actually put in
each file, see the [Configuration reference](../configuration/) — one page per editable file.

::: tip Where to look things up
Everything about Hailer, is on [docs.hailer.com](https://docs.hailer.com):

- **SDK** (this documentation): <https://docs.hailer.com/sdk/>
- **API**: <https://docs.hailer.com/api/>, with one page per endpoint. Open the exact endpoint
  page for its arguments and return shape; do not rely on a summary.
- **`@hailer/cli`**: <https://docs.hailer.com/cli/> and
  [programmatic usage](https://docs.hailer.com/cli/programmatic-usage).
- **For LLMs and agents**: <https://docs.hailer.com/llms.txt> indexes every page.
:::

## Subcommands

| Command | Purpose | Creates | Deletes | Updates |
|---|---|:-:|:-:|:-:|
| `pull` | Regenerate the whole `workspace/` directory from the remote state. **Local edits not yet pushed are overwritten**, so push first. Offers to clone apps with a `gitUrl` into `apps/` | — | — | — |
| `push` | Push everything (all sections below) | ✅ | ✅ | ✅ |
| `workflows sync` | Create / delete workflows | ✅ | ✅ | ❌ |
| `workflows push` | Update workflow settings (`main.ts`) | ❌ | ❌ | ✅ |
| `workflows covers [workflow...]` | Upload a random gradient cover image and set it with its color on the named workflows (names, enums keys or ids). `--force` replaces an existing cover, `--all` covers every workflow without one. Pull afterwards | ❌ | ❌ | ✅ |
| `fields push` | Create / update / delete fields | ✅ | ✅ | ✅ |
| `phases push` | Create / update / delete phases | ✅ | ✅ | ✅ |
| `templates sync` | Create / delete document templates | ✅ | ✅ | ❌ |
| `templates push` | Update template config + code | ❌ | ❌ | ✅ |
| `teams push` | Create / update / delete teams | ✅ | ✅ | ✅ |
| `groups push` | Create / update / delete groups | ✅ | ✅ | ✅ |
| `insights push` | Create / update / delete insights | ✅ | ✅ | ✅ |
| `apps push` | Create / update / delete apps | ✅ | ✅ | ✅ |
| `actions sync` | Create / delete actions (new ones start disabled with placeholder code) | ✅ | ✅ | ❌ |
| `actions push` | Update action config + code + dependencies | ❌ | ❌ | ✅ |
| `actions run <action>` | Test-run an action's **local** files in the Hailer sandbox without saving (`--input`, `--input-file`, `--activity`, `--member`) | — | — | — |

```bash
hailer-sdk ws-config pull -e <email> -p <password> -w <workspace-id>
hailer-sdk ws-config push                 # push all sections
hailer-sdk ws-config fields push          # or push one section
hailer-sdk ws-config workflows sync --force
hailer-sdk ws-config workflows covers invoices_f6e --force
hailer-sdk ws-config actions run "Quote approved" --activity <activity-id>
```

Each section maps to a file (or set of files) in `workspace/`. What every property in those
files does is documented per file:

| Section | File(s) | Reference |
|---|---|---|
| Workflows | `workflows.ts`, `<workflow>/main.ts` | [Workflows](../configuration/workflows) |
| Fields | `<workflow>/fields.ts` | [Fields](../configuration/fields) |
| Phases | `<workflow>/phases.ts` | [Phases](../configuration/phases) |
| Templates | `<workflow>/templates.ts` + `templates/` | [Templates](../configuration/templates) |
| Teams | `teams.ts` | [Teams](../configuration/teams) |
| Groups | `groups.ts` | [Groups](../configuration/groups) |
| Insights | `insights.ts` | [Insights](../configuration/insights) |
| Apps | `apps.ts` | [Apps](../configuration/apps) |
| Actions | `actions.ts` + `actions/` | [Actions](../configuration/actions) |

## Common options

| Option | Alias | Description |
|---|---|---|
| `--email <email>` | `-e` | Hailer account email. |
| `--password <password>` | `-p` | Hailer account password. |
| `--user-api-key <key>` | | API key auth (overrides email/password). |
| `--workspace <id>` | `-w` | Workspace id. |
| `--api-url <url>` | `-a` | API URL. |
| `--verbose` | | Detailed logging. |
| `--force` | | Skip confirmation prompts (delete prompts, and the app-clone prompt on `pull`). |

Use **either** `--user-api-key` **or** `--email` + `--password`. Credentials can also come from
`config.json` / `.env` (see [`init`](./init)).

## The sync model — how push decides

Every push compares three versions of each item — your **local** file, the current **remote**,
and the **snapshot** from your last pull (`.metadata.json`) — and acts:

- **Create** — an item with no `_id` (templates: no `templateId`) is created on the server.
- **Update** — an item with an `_id` is updated only if it changed, and only if the change is
  yours: if the remote changed since your last pull, or both sides changed, or there's no
  snapshot entry, the item is **skipped** and you're told to `pull` first.
- **Delete** — an item on the server but missing locally is deleted **only if** the snapshot
  proves it existed at your last pull; otherwise it's assumed to be new-on-server and skipped.
  Deletions prompt for confirmation unless `--force`.

This is why the loop is **pull → edit → push → pull**: the snapshot is what lets the SDK tell
your change apart from someone else's, so a push never silently clobbers a colleague's edit in
the Hailer UI. The full rules, the `.metadata.json` format, and which fields are ignored are in
the [Configuration reference overview](../configuration/).

::: tip Always pull after pushing
After a push, `pull` again to refresh the snapshot. Without an up-to-date snapshot your next
push reports "remote changed since last pull" — for changes that are actually your own.
:::

## Typical workflow

```bash
# 1. Pull current state (writes workspace/*.ts + the .metadata.json snapshot)
hailer-sdk ws-config pull

# 2. Edit the TypeScript files under workspace/
#    (see the Configuration reference for every option)

# 3. Push — everything, or just the section you changed
hailer-sdk ws-config push
# hailer-sdk ws-config fields push
# hailer-sdk ws-config phases push

# 4. Pull again to sync generated ids and refresh the snapshot
hailer-sdk ws-config pull
```

Tips:

- **Pull before editing**, and **pull after pushing** — keeps your snapshot current.
- **Push incrementally** — push just the section you changed instead of everything.
- **Commit `.metadata.json`** so teammates share the same conflict baseline.
- **Test in a non-production workspace first**, especially for changes that delete.
