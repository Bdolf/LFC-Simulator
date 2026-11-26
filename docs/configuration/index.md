---
title: Configuration reference
description: The workspace/ directory — every editable file, the sync/snapshot model, and how create, update, and delete are decided on push.
audience: public
status: stable
tags: [sdk, configuration, workspace, sync, metadata, reference]
source: hailer-sdk
generated: false
---

# Configuration reference

Running [`hailer-sdk ws-config pull`](../commands/workspace-config) writes your entire workspace
into a `workspace/` directory of TypeScript files. You edit those files and push them back.
This section documents **every file and every property you can configure in it**.

## The `workspace/` directory

```
workspace/
├── .metadata.json                  # sync snapshot — DON'T EDIT (regenerated on every pull)
├── workflows.ts                    # registry of workflows (create/delete workflows)
├── teams.ts                        # workspace teams
├── groups.ts                       # workspace groups
├── insights.ts                     # workspace insights (reports)
├── apps.ts                         # workspace apps
├── actions.ts                      # registry of actions (create/delete actions)
├── actions/                        # one folder per action (if the workspace has actions)
│   └── <ActionName>_<id>/
│       ├── action.config.ts        # triggers, credentials, network, limits, enabled
│       ├── action.code.ts          # the code — exports execute(input)
│       └── package.json            # dependencies (if any)
├── enums.ts                        # generated id enums — DON'T EDIT
├── hailer.d.ts                     # generated type definitions — DON'T EDIT
└── <WorkflowName>_<id>/            # one folder per workflow
    ├── main.ts                     # workflow settings
    ├── fields.ts                   # field definitions
    ├── phases.ts                   # phase definitions
    ├── functions/                  # function-field code (if any)
    ├── templates.ts                # document-template registry (if the workflow has templates)
    └── templates/<TemplateName>_<id>/
        ├── template.config.ts      # template field mappings + options
        └── template.code.ts        # PDF/CSV generation function
```

| File                                     | Configures                              | Reference                |
| ---------------------------------------- | --------------------------------------- | ------------------------ |
| `workflows.ts`                           | Which workflows exist (create / delete) | [Workflows](./workflows) |
| `<workflow>/main.ts`                     | A workflow's settings                   | [Workflows](./workflows) |
| `<workflow>/fields.ts`                   | A workflow's fields                     | [Fields](./fields)       |
| `<workflow>/phases.ts`                   | A workflow's phases                     | [Phases](./phases)       |
| `<workflow>/templates.ts` + `templates/` | Document templates                      | [Templates](./templates) |
| `teams.ts`                               | Workspace teams                         | [Teams](./teams)         |
| `groups.ts`                              | Workspace groups                        | [Groups](./groups)       |
| `insights.ts`                            | Workspace insights                      | [Insights](./insights)   |
| `apps.ts`                                | Workspace apps                          | [Apps](./apps)           |
| `actions.ts` + `actions/`                | Workspace actions (sandboxed code)      | [Actions](./actions)     |

`enums.ts`, `hailer.d.ts`, and `.metadata.json` are **generated** — never hand-edit them.
Every editable file imports its types from `hailer.d.ts`, so your editor autocompletes and
type-checks every property described in this reference.

## How push decides: create, update, delete

Each configurable file exports an **array** (or, for `main.ts`, a single object). Every push
command compares three things for each item: your **local** version, the current **remote**
version, and the **snapshot** recorded at your last pull (`.metadata.json`). The rules are
identical for workflows, fields, phases, teams, groups, insights, apps, templates, and actions.

### Create

An item **without an `_id`** (for templates, without a `templateId`) is treated as new and
created on the server. After creating, the SDK assigns the real id — run `pull` to bring it
into your local files.

```typescript
// A new field: no _id → created on push
{ label: "Priority", type: "textpredefinedoptions", data: ["Low", "High"] }
```

### Update

An item **with an `_id`** is matched to its remote counterpart and updated **only if
something changed**. The SDK hashes the normalized local and remote versions and compares
both against the snapshot:

| Local vs remote | Since last pull                | Result                                      |
| --------------- | ------------------------------ | ------------------------------------------- |
| Identical       | —                              | Skip (nothing to do)                        |
| Different       | Only **you** changed it        | **Update** ✅                               |
| Different       | Only the **server** changed it | Skip — `pull` first                         |
| Different       | **Both** changed it            | Skip — conflict, `pull` and reconcile       |
| Different       | No snapshot entry exists       | Skip — `pull` first to establish a baseline |

This is why you should always `pull` before editing and `pull` again after pushing: the
snapshot is what lets the SDK tell _your_ change apart from someone else's.

### Delete

An item present on the server but **absent from your local file** is deleted — but only if
the snapshot has a hash for it (proving it existed at your last pull). If there's no snapshot
entry, the SDK assumes it was created remotely after your pull and **skips the deletion** to
avoid data loss. Deletions prompt for confirmation unless you pass `--force`.

### System fields are ignored

Before hashing, the SDK normalizes each entity: it strips server-managed fields (`uid`,
`created`, `updated`, `cid`, and a handful of computed/immutable properties per entity). The
exact set stripped per entity is documented as **read-only** on each page. Editing any of
them has no effect — what remains after normalization is what you actually control. `_id` is
retained in the local file and included in the hash (harmless, since it's identical across
local, remote, and snapshot), but it is **not** sent in the update body — it's used as the
match key and passed to the API separately.

## The sync snapshot (`.metadata.json`)

`pull` writes `.metadata.json` at the workspace root: a content-hash snapshot of every item
as it existed on the server at pull time.

```jsonc
{
  "version": 1,
  "pulledAt": 1779171963557,
  "workflows": {
    "<workflowId>": {
      "self": "<hash>", // main.ts
      "fields": { "<fieldId>": "<hash>" },
      "phases": { "<phaseId>": "<hash>" },
      "templates": { "<templateId>": "<hash>" },
    },
  },
  "teams": { "<teamId>": "<hash>" },
  "groups": { "<groupId>": "<hash>" },
  "insights": { "<insightId>": "<hash>" },
  "apps": { "<appId>": "<hash>" },
  "actions": { "<actionId>": "<hash>" },
}
```

**Commit it to git.** Sharing the snapshot gives teammates the same divergence baseline, so
everyone's pushes detect conflicts against the same reference point. If the file is missing
(first run after an upgrade, or someone deleted it), push and sync refuse to update or delete
items they can't verify — run `pull` to rebuild the baseline.
