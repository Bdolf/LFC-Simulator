---
title: Actions
description: Configure workspace actions as code — the actions.ts registry, per-action config (triggers, credentials, network, limits), the code that runs in Hailer's sandbox, and how to create, push and test-run actions from the CLI.
audience: public
status: beta
tags: [sdk, configuration, actions, automation, sandbox, triggers, credentials]
source: hailer-sdk
generated: false
---

# Actions

An **action** is your own TypeScript/JavaScript that Hailer runs in an isolated sandbox
when something happens in a workflow, when a member joins or leaves the workspace, on a
schedule, or on demand. The SDK manages actions as code: `pull` writes every action into
`workspace/actions/`, you edit the files, and `actions push` sends them back.

```
workspace/
├── actions.ts                           # registry — which actions exist (create/delete)
└── actions/
    └── <action_name>_<id3>/             # one folder per action
        ├── action.config.ts             # name, enabled, triggers, credentials, network, limits
        ├── action.code.ts               # the code — must export execute(input)
        └── package.json                 # dependencies (only when the action has any)
```

Actions are **workspace-level** (not per workflow) and **admin/owner only**: `v3.action.list`
refuses plain members, so a member's `pull` fails at the actions step. The project's user API
key must belong to a workspace admin or owner, see [`init`](../commands/init).

For what actions can do and how the sandbox behaves in depth, read the platform guide
[Actions](https://docs.hailer.com/api/guides/actions). This page covers the SDK side: the files,
the commands and the lifecycle.

## `actions.ts` — the registry

```typescript
export const actions: HailerActionEntry[] = [
  { _id: "6aaa313bf1fb5dcf4ecc6432", name: "Quote approved", folder: "quote_approved_432" },
  { name: "Chase stale tickets" },               // new — no _id → created on `actions sync`
  { name: "Scratch experiment", folder: "scratch" }, // unsaved — only for `actions run`, see below
];
```

| Property | Type | Notes |
|---|---|---|
| `_id` | `string?` | Present for saved actions. **Omit to create.** Never change it, it is the match key against the remote action. |
| `name` | `string` | Action name, max 128 characters. Shown in the UI and on run records. |
| `folder` | `string?` | Folder under `workspace/actions/`. Auto-generated on `pull` as `<sanitized name>_<last 3 chars of id>`. |

**Create:** add an entry with only a `name`, run `actions sync`, then `pull`. The action is
created **disabled** with placeholder code, and `pull` generates its folder.
**Delete:** remove the entry and run `actions sync`. The deletion is snapshot-guarded and
prompts unless `--force`.

## `action.config.ts` — settings

Exports a `HailerActionConfig`: everything about the action except the two parts that live in
their own files (`code` → `action.code.ts`, `packageJson` → `package.json`). `pull` replaces raw ids
with enums from `../../enums`, so you reference workflows, phases and credentials by name.

```typescript
import { Quotes_PhaseIds, WorkflowIds, WorkspaceCredentialIds } from "../../enums";

export const action: HailerActionConfig = {
  _id: "6aaa313bf1fb5dcf4ecc6432",
  name: "Quote approved",
  description: "Posts the approved quote to Slack and stamps the approval date.",
  enabled: true,
  credentialIds: [WorkspaceCredentialIds.slack_bot_token_4c4, WorkspaceCredentialIds.hailer_api_key_4d2],
  allowNet: ["slack.com", "api.hailer.com"],
  limits: { wallTimeMs: 30_000 },
  maxRunsPerHour: 200,
  triggers: [
    `phase.activity-moved:${WorkflowIds.Quotes}:${Quotes_PhaseIds.Approved}`,
    `phase.activity-created:${WorkflowIds.Quotes}:${Quotes_PhaseIds.Approved}`,
  ],
  schedule: { cron: "0 9 * * 1-5", tz: "Europe/Helsinki" },
};
```

| Property | Type | Description |
|---|---|---|
| `_id` | `string` | The action id. Written by `pull`; also used to link test runs to the saved action. |
| `name` | `string` | Max 128 characters. Renaming changes the folder name on the next `pull`. |
| `description` | `string?` | Free text, max 2048 characters. |
| `enabled` | `boolean` | The kill switch. `false` pauses every trigger and makes manual runs end as `config_error`. New actions start disabled. |
| `credentialIds` | `string[]` | Workspace credentials injected as environment variables. Use `WorkspaceCredentialIds.*`. Max 16. |
| `allowNet` | `string[]?` | Hosts the code may reach, e.g. `["api.hailer.com"]`. **Default: no network at all.** Max 32. Entries are `host` or `host:443` only: no scheme, no path, no other port. A bad entry is rejected by the sandbox at run time and the run ends as `config_error`. |
| `limits` | `{ wallTimeMs?: number }?` | Time budget for one run, 1 000 to 600 000 ms. Default 60 s. Exceeding it kills the run as `timeout`. |
| `maxRunsPerHour` | `number?` | Cap on event-triggered runs (phase, workspace, schedule) in a sliding hour. Default 1000, max 1 000 000. Manual and test runs are exempt. Bounds self-firing loops. |
| `triggers` | `string[]` | Event trigger keys, see below. Max 32, unique. `[]` when the action has no event triggers. |
| `schedule` | `{ cron, tz? }?` | Cron schedule firing `schedule.run`, see below. Absent means no schedule. |

**Read-only** (stripped before hashing, editing them has no effect): `workspaceId`,
`createdBy`, `created`, `updated`, and `nextRunAt` inside `schedule`.

### Triggers — where an action runs

A trigger is a **key**: the event name followed by its parameters, joined with `:`. An action
can bind any mix of them. `v3.action.triggers` lists the events and their parameters.

| Kind | Key | Fires when |
|---|---|---|
| **Phase** | `phase.activity-created:<workflowId>:<phaseId>`, `phase.activity-updated:…`, `phase.activity-moved:…` | An activity is created in, updated in, or moved into that phase. Fires for changes by any member. |
| **Workspace** | `workspace.member-joined`, `workspace.member-left` (no parameters) | A member joins (any invite path) or leaves / is removed. No phase needed. |

`pull` writes phase keys as template literals with the enums, so you never type an id:

```typescript
triggers: [
  // created in, or moved into, the "Approved" phase of the Quotes workflow
  `phase.activity-created:${WorkflowIds.Quotes}:${Quotes_PhaseIds.Approved}`,
  `phase.activity-moved:${WorkflowIds.Quotes}:${Quotes_PhaseIds.Approved}`,
  // every new workspace member
  "workspace.member-joined",
]
```

`manual` and `schedule.run` are run events, never trigger keys.

::: warning `triggers` is replaced as a whole on every push
`actions push` always sends the full `triggers` list. The server validates every key (known
event, right number of parameters, phase existing in this workspace, no duplicates) and
rejects the whole update with `InvalidArguments` if one is bad.
:::

The same phase can also be bound from the phase's settings in the Hailer workflow editor.
Either way the binding is stored on the action, so it shows up in `action.config.ts` after
the next `pull`. Removing a phase or a workflow removes its triggers from every action.

### Schedule — when an action runs on its own

One optional cron schedule per action, separate from `triggers`:

```typescript
schedule: { cron: "0 9 * * 1-5", tz: "Europe/Helsinki" }, // weekdays at 09:00 Helsinki time
```

`cron` is a 5-field expression (minute hour day-of-month month day-of-week). `tz` is an IANA
timezone; UTC when absent. The server rejects an expression that never fires. The stored
schedule carries `nextRunAt`, which `pull` strips. Removing `schedule` from the file and
pushing clears it remotely.

::: warning `schedule` restarts on every push that sends it
`actions push` always sends `schedule`, so any changed push to an action with a schedule
restarts it from now and recomputes `nextRunAt`, even when `cron` and `tz` did not change.
:::

## `action.code.ts` — the code

The sandbox writes this file into a fresh working directory, imports it as a module and calls
its `execute` export once. It must `export function execute(input)` (or a default function).

```typescript
export async function execute(input: unknown) {
  // do work
  return { ok: true };
}
```

### What `execute(input)` receives

Whatever started the run, `input` is one object with the same four properties, the
**envelope**. Only `payload` differs per event:

```typescript
{
  event: "phase.activity-moved",   // which event started the run, see the table
  payload: { ... },                // the event's data, shape depends on `event`
  workspaceId: "6aaa...",          // the workspace the action belongs to
  triggeredBy: "5f2b...",          // user id whose action caused the event; absent on schedule runs
}
```

Code branches on `input.event` and reads `input.payload`; it never needs to know whether a
trigger, a schedule, a manual run or `actions run` started it.

::: tip Unsure what you get? Log it once.
The shapes below are what the API delivers today, but the fastest way to see the exact
object for your workflow is to print it and test-run the action:

```typescript
export async function execute(input) {
  console.log(JSON.stringify(input, null, 2));
  return { ok: true };
}
```

```bash
npm run actions-run -- "Quote approved" --activity <activityId>   # or --member <userId>, or --input '{...}'
```

The full `input` shows up under `stdout` in the printed run record. Copy it into a JSON file
and replay it with `--input-file` while you develop.
:::

#### `manual`

`payload` is whatever was passed in: the `--input` / `--input-file` JSON of `actions run`, or
the second argument of `v3.action.trigger`. `null` when nothing was given. `triggeredBy` is
the caller.

#### `phase.activity-created` / `phase.activity-updated` / `phase.activity-moved`

```typescript
{
  activities: [                     // the activities AFTER the change; several when one event touched several
    {
      _id: "...",
      name: "Quote #42",
      workflowId: "...",
      phaseId: "...",
      phaseKey: "approved",         // only when the phase has a key
      workspaceId: "...",
      createdBy: "...",
      created: 1788771600000,
      updated: 1788771660000,
      files: ["<fileId>", ...],     // file ids, when any
      fields: {                     // one entry per field that HAS a value
        "<fieldKey or fieldId>": "Acme Oy",   // keyed by the field's key, or by its id when it has no key
        "<fieldKey or fieldId>": 1200,
      },
      // may also carry: teamId, followerIds, discussionId, priority, sequence, location
    },
  ],
  changes: {                        // only present when there is something to report
    "<activityId>": {
      files: { added: {...}, removed: {...}, current: {...} },  // when the update touched files
      previousPhase: { _id: "...", key: "draft" },              // on phase.activity-moved: the phase it left
    },
  },
}
```

`triggeredBy` is the member whose change caused the event. Fields without a value are
omitted from `fields`, so read them with a fallback. On `-moved`, `payload.activities[i].phaseId`
is the new phase and `payload.changes[id].previousPhase` the old one.

#### `workspace.member-joined`

```typescript
{
  user: { _id: "...", firstname: "Ada", lastname: "Lovelace", email: "ada@example.com" },
  invite: {                         // snapshot of the consumed invitation; the invite doc itself is deleted on join
    _id: "...",                     // absent when the invite was consumed at once (auto-join on send)
    workspaceId: "...",
    email: "ada@example.com",
    invitedBy: "...",
    // may also carry: uid, name, title, notes, teams, role, customRole, discussionIds, created
  },
}
```

`triggeredBy` is the new member. In `actions run --member`, the caller stands in as `invitedBy`.

#### `workspace.member-left`

```typescript
{
  user: { _id: "...", firstname: "Ada", lastname: "Lovelace", email: "ada@example.com" },
  removedBy: "...",                 // the user themselves on leave, the admin on removal
}
```

The user is already gone from the workspace when the run starts. `triggeredBy` equals `removedBy`.

#### `schedule.run`

```typescript
{
  scheduledFor: 1788771600000,      // the minute the cron expression matched, epoch ms
  firedAt: 1788771603210,           // when Hailer actually started the run, epoch ms
}
```

`triggeredBy` is **absent**: nobody caused a scheduled run. The run is attributed to the
action's creator.

### Rules of the sandbox

- **The run ends when the promise returned by `execute` settles.** The wrapper awaits it,
  stores the result and exits. Un-awaited timers, dangling promises and open sockets are
  dropped, so anything that must happen has to be on the awaited path
  (`await new Promise(r => setTimeout(r, 1000))`, not a bare `setTimeout`). Always call
  `disconnect()` on a `@hailer/cli` client in a `finally` block, otherwise the open socket
  keeps the process alive until the `wallTimeMs` kill and the run ends as `timeout`.
- **Return plain data.** The return value is JSON-serialised and stored as the run's `output`.
  Returning nothing, or something unserialisable, stores `null`.
- **Logging.** `console.log` → `stdout`, `console.error` → `stderr`, both stored on the run
  record, 1 MB max each. Crossing a cap kills the run as `output_limit`.
- **Failure.** An uncaught exception or a non-zero exit ends the run as `runtime_error`; the
  stack trace is in `stderr`.
- **Nobody is logged in.** `triggeredBy` is just an id. To read or write anything in Hailer the
  code logs in itself with a user API key from a credential, using
  [`@hailer/cli`](https://docs.hailer.com/cli/). Everything it does is done as that user.
- **No network** unless the host is in `allowNet`. No subprocesses, no FFI, file access only
  inside the run's working directory, nothing persists between runs.
- **Imports resolve only from `package.json`.** An undeclared import fails at startup.
- **The file is self-contained.** Only `action.code.ts` and `package.json` reach the sandbox, so
  nothing from the project can be imported: no `enums.ts`, no `hailer.d.ts`, no other file.
  Refer to fields and phases by their **key** (`input.payload` fields are keyed by field key,
  activities carry `phaseKey`), and put any id you still need in a `const` at the top of the file.

### Calling Hailer from an action

```typescript
import { Client } from "@hailer/cli";

export async function execute(input) {
  const hailer = await Client.create({ userApiKey: process.env.HAILER_API_KEY });
  try {
    for (const activity of input.payload.activities) {
      if (!activity.discussionId) continue;
      await hailer.request("messenger.send", [{ msg: `${activity.name} was approved.` }, activity.discussionId]);
    }
    return { messaged: input.payload.activities.length };
  }
  finally {
    hailer.disconnect();
  }
}
```

This needs three things in the config: `@hailer/cli` in `package.json`, `"api.hailer.com"` in
`allowNet` (pass `host` to `Client.create` for another environment), and a credential holding
the key in `credentialIds`. Use a dedicated automation user for the key so the audit trail
stays clear.

### Types in the editor

`action.code.ts` type-checks inside your Node project: secrets are read with `process.env`,
which `@types/node` covers. Packages from the action's `package.json` are not installed in
the project, so their imports show as unresolved in the editor; they resolve in the sandbox.

## `package.json` — dependencies

Optional. Written verbatim, exactly as a local `package.json`; only `dependencies` matters.
`pull` only creates the file when the action has dependencies; delete it locally and `push`
clears them remotely.

```json
{ "dependencies": { "@hailer/cli": "1.2.3", "@slack/web-api": "^7" } }
```

Dependencies are installed before the code runs, with their own time budget that does not
count against `wallTimeMs`. A failed install ends the run as `runtime_error` with the
installer's output in `stderr`.

## Credentials

Secrets never live in the code. They are stored in the **workspace credential vault** and bound
to the action by id. A credential is a named set of variables (`SLACK_TOKEN`, `HAILER_API_KEY`,
`CRM_URL`); at run time every variable of every bound credential becomes one environment
variable, read with `process.env.SLACK_TOKEN`. Strings are passed as-is, anything else as
JSON. When two credentials define the same variable, the later one in `credentialIds` wins.

The SDK does not create credentials (they hold secrets). The order is:

1. Create the credential in the Hailer workspace settings. Only **workspace** credentials can
   be bound to actions, not personal ones.
2. `pull`. The credential appears in `workspace/enums.ts` as `WorkspaceCredentialIds.<name>_<id3>`.
3. Reference it in `action.config.ts` → `credentialIds`.
4. `actions push`.

Variable names must be legal environment variable names (letters, digits, underscores, not
starting with a digit); uppercase with underscores is the convention. Names starting with
`DENO_` and names the runtime uses (`PATH`, `HOME`, `TMPDIR`) are rejected; a run whose
credentials break these rules, or whose credential was deleted after binding, ends as
`config_error` before anything executes.
Environment variables are visible to dependencies too, so keep `allowNet` to the hosts the
action really needs.

## Lifecycle

```bash
# 1. Declare the action
#    workspace/actions.ts → { name: "Quote approved" }
hailer-sdk ws-config actions sync        # creates it remotely, disabled, with placeholder code
hailer-sdk ws-config pull                # generates workspace/actions/quote_approved_432/

# 2. Edit action.code.ts, action.config.ts (triggers, credentials, allowNet), package.json

# 3. Test the LOCAL files in the real sandbox, without saving anything
hailer-sdk ws-config actions run "Quote approved" --activity 6a9e7d4a3a088f5c1e7cbcf5

# 4. Save
hailer-sdk ws-config actions push
hailer-sdk ws-config pull                # refresh the snapshot

# 5. Go live: set enabled: true in action.config.ts, push again
```

New actions are created **disabled** on purpose: bind triggers and test first, then flip
`enabled: true` and push. While disabled, phase, workspace and schedule triggers skip the
action silently, a manual run (`v3.action.trigger`) is recorded as `config_error`, and
`actions run` still works because it never touches the saved action.

## Commands

| Command | Purpose | Creates | Deletes | Updates |
|---|---|:-:|:-:|:-:|
| `actions sync` | Create actions that have no `_id` in `actions.ts` (disabled, placeholder code); delete remote actions missing from the registry (snapshot-guarded, prompts unless `--force`). Run `pull` afterwards. | ✅ | ✅ | ❌ |
| `actions push` | Update every action from its `action.config.ts` + `action.code.ts` + `package.json`. Full replace of the mutable fields; a missing optional (`description`, `packageJson`, `allowNet`, `limits`, `maxRunsPerHour`, `schedule`) is sent as `null` and cleared remotely. Guarded by the usual [snapshot/conflict model](./#how-push-decides-create-update-delete). | ❌ | ❌ | ✅ |
| `actions run <action>` | Run the **local** files of one action in the Hailer sandbox through `v3.action.run`, without saving. | — | — | — |

The aggregate `ws-config push` includes `actions push` (after apps).

### `actions run` — test local code

```bash
hailer-sdk ws-config actions run <name | id> [input option]
```

`<action>` is a name (case-insensitive) or a 24-hex id from `actions.ts`. The command loads
the action's folder, sends `code`, `packageJson`, `credentialIds`, `allowNet` and `limits` to the
server, and prints the run record: id, status, wall time, exit code, message, then `stdout`,
`stderr` (to the process's stderr) and `output` when present. The run is recorded with
`test: true` and linked to the saved action when the entry has an `_id`.

| Option | Delivers |
|---|---|
| *(none)* | `event: "manual"`, `payload: null`. |
| `--input <json>` | `event: "manual"`, `payload` = the parsed JSON. |
| `--input-file <path>` | Same, read from a JSON file (handy for long `{ activities: [...] }` fixtures). |
| `--activity <id>` | `event: "phase.activity-created"` with that one activity, exactly as a phase trigger delivers it. |
| `--member <userId>` | `event: "workspace.member-joined"` with that member, exactly as a membership trigger delivers them; the caller stands in as `invitedBy`. |
| `--member <userId> --member-event left` | `event: "workspace.member-left"`; the caller stands in as `removedBy`. |

At most one input option per run. A `schedule.run` event cannot be simulated; test schedule
code with `--input` and branch on `input.event`.

- **Waits up to 25 s, then stops watching.** A run that finishes in time prints its final
  record. A longer run prints the record as it stands (`queued` or `running`) and finishes in
  the background. **The command does not poll**: the final status, `stdout` and `output` of
  such a run are only in the Hailer UI run list. That is a server-side wait window, not a
  failure. Keep test runs short, or log early so the useful part lands before the window ends.
- **Exit code** 0 for `completed`, `queued` and `running`; 1 for every failure status
  (`runtime_error`, `timeout`, `output_limit`, `config_error`, `denied`, `infra_error`) so the
  command can gate a script or CI step.
- **Billed like any run:** one workspace token per started sandbox second, minimum one.
- **Works on disabled actions** and on **unsaved ones**. An entry with a `name` and a `folder`
  but no `_id`, plus a hand-made folder with `action.config.ts` and `action.code.ts`, runs fine.
  Nothing is linked or saved; it is the closest thing to a local dev loop.

## Run statuses

| Status | Meaning |
|---|---|
| `queued` / `running` | Accepted / executing. What you see when the 25 s window elapsed. |
| `completed` | `execute` returned; `output` holds the value, `exitCode` is 0. |
| `runtime_error` | The code threw, exited non-zero, or the dependency install failed. See `stderr`. |
| `timeout` | Killed after `wallTimeMs`, or the install exceeded its budget. |
| `output_limit` | Killed for exceeding the 1 MB stdout/stderr cap. |
| `config_error` | Never started: action disabled (saved runs only), or a credential missing / invalid. Free. |
| `denied` | Never started: no workspace tokens, or `maxRunsPerHour` exhausted. Free. |
| `infra_error` | The platform failed, not your code. Free. Never retried automatically, so design actions to be safe to run twice. |
| `cancelled` | Cancelled while still queued. |

## Limits

| Limit | Value |
|---|---|
| `name` / `description` | 128 / 2048 characters |
| `code` / `package.json` size | 512 KB / 64 KB |
| `allowNet` entries / `credentialIds` | 32 / 16 per action |
| `triggers` | 32 per action, each key at most 256 characters |
| `limits.wallTimeMs` | 1 000 to 600 000 ms, default 60 000 |
| `maxRunsPerHour` | default 1000, max 1 000 000; manual and test runs exempt |
| stdout / stderr | 1 MB each |

## How push applies changes

`actions push` is update-only. For each registry entry with an `_id` it loads
`action.config.ts` (via jiti), `action.code.ts` and `package.json`, assembles the full action,
hashes it against the remote action and the `.metadata.json` snapshot, and if only your side
changed sends **one** `v3.action.update` with every mutable field. Entries without an `_id` are
skipped with a hint to run `actions sync`. Creating and deleting is `actions sync`'s job.

## Known edges

- Push always sends `schedule`, so it restarts on every changed push (see the warning
  above). Pushing an unrelated edit to an action with a schedule still recomputes its
  `nextRunAt`.
- Only `phase.*` keys get enums on `pull`. A trigger kind the SDK does not know stays a plain
  string with raw ids; add its pattern to `replaceTriggerKeysWithEnums` in `pull.ts`.
- `pull` writes `package.json` only when the action has one. If the API ever returned
  `packageJson: null` explicitly, push would read it as absent and report one false conflict
  until the next `pull`. The backend unsets the field instead of storing `null`, so this does
  not occur in practice.
- The hailer-mcp bash guard intercepts `actions-push` and `actions-sync` like every other
  push/sync script. `actions-run` is not intercepted: it saves nothing, but it does spend
  workspace tokens.
