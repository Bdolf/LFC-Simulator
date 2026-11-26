# Hailer SDK + MCP Project

You're working in a project scaffolded by `@hailer/sdk`. The `workspace/` directory IS the source of truth for all workflow configuration; the MCP server (remote or local) exposes runtime tools.

You are a single agent. No sub-agents, no dispatching, no delegating to other agents — everything below assumes you do the reading, writing, and running yourself.

## The One Rule

**If it can be done locally, do it locally. MCP tools are ONLY for things that require a server call.**

Local = read `workspace/` files, run `npm run …` SDK commands, use `npx @hailer/create-app`, run vitest.
Remote = MCP tools for activities, discussions, calendar, insights, files, permissions, marketplace.

Before any MCP call, ask: "Is this answerable from `workspace/` files or a CLI?" If yes, do that instead. (SDK-profile connections don't even serve the shadowed tools; if you can see them, you're on a general connection — the rule still applies.)

## Workflow, not dataset, for stage-based work

A "dataset" and a "workflow" are the **same backing entity** — the only difference is the `enableUnlinkedMode` flag in the workflow config. Unset/`false` = a phased workflow (activities live in phases and move between stages). `true` = a dataset (a flat list, activities detached from phase progression).

**If the brief involves phases, stages, statuses, a pipeline, or moving items between steps, build a phased workflow — leave `enableUnlinkedMode` unset (false).** Reserve datasets (`enableUnlinkedMode: true`) for flat reference data with no progression (contact lists, product catalogues). Why: when activities are spread across phases, generating an app that correctly displays records from ALL phases at once is error-prone and takes many retries — picking the right structure up front avoids the churn and wasted tokens.

## What Goes Where

| Need | Do this | Don't |
|------|---------|-------|
| Find workflow / field / phase IDs | Read `workspace/enums.ts` | `describe_workflows` |
| See field types, labels, options | Read `workspace/<Name>_<id>/fields.ts` | `describe_workflows` |
| See phases | Read `workspace/<Name>_<id>/phases.ts` | `describe_workflows` |
| See all workflows | Read `workspace/workflows.ts` | `describe_workflows` |
| Create / modify fields or phases | Edit `fields.ts` / `phases.ts` → `npm run fields-push:force` / `phases-push:force` | `update_workflow_structure` |
| Create / modify workflows | Edit `workflows.ts` → `npm run workflows-sync:force` | `install_workflow` |
| Cover image | `npm run workflows-covers -- <workflow-key...>` → `npm run pull` | — |
| Cosmetic workflow settings (color, description, defaultView) | Edit `main.ts` → `npm run workflows-push` | — |
| Create / modify teams / groups | Edit `teams.ts` / `groups.ts` → `npm run teams-push:force` / `groups-push:force` | — |
| Create / modify insights config | Edit `insights.ts` → `npm run insights-push:force` | — (runtime `run_insight` is fine) |
| Create / modify document templates | Edit `templates/` → `npm run templates-sync:force` | — |
| Test function field code | vitest locally | `test_function_field` |
| Scaffold an app | `cd apps && npx @hailer/create-app <name> --template react-ts`, then the 5 scaffold fixes in `create-and-publish-app` (name POSITIONAL not `--name`; bare command PROMPTS and hangs) | — (script-only; no MCP tool exists) |
| Publish an app | `cd app && npm run publish-production -- --force` (add `--market` for marketplace versions) | — (script-only; no MCP tool exists) |
| Share / edit EXISTING app metadata | Edit `workspace/apps.ts` → `npm run apps-push:force` | `manage_app` |
| Create an app entry | NEVER via apps.ts (create there technically works — omit `_id` → `v3.app.create` — but needs the real deployed URL); first publish with `--create` does it (correct URL included) | never invent placeholder URLs |
| Create / update activities | MCP `create_activity`, `update_activity` | — |
| List / read / count activities | MCP `list_activities` (`countOnly: true` for counts), `show_activity_by_id` | — |
| Query data (SQL reports) | MCP `run_insight`, `save_insight` | — |
| Discussions, calendar, files, users | MCP runtime tools | — |
| Workflow permissions | MCP `set_workflow_permission`, `list_workflow_permissions`, `check_user_permissions` | — |
| Live activity counts / orientation | MCP `core_init` (once per session) | — |
| Create a bot / AI agent | `ensure_agent_directory` → `create_activity` → move to Deployed (load `provision-bot`) | workflows-sync / install_workflow for the Agent Directory |

## Environment assumptions

Edit files with your edit tools. For anything scripted, use `node` — it exists in every SDK project. Never assume `python`/`python3` is installed (Studio sandboxes may not have it); a python heredoc that works locally dies in production.

## Reading workspace/ Files

Read selectively — don't dump whole files into context.

1. `grep` `workspace/enums.ts` for the specific workflow/field/phase name instead of reading the whole file
2. Read only the one `workspace/<Name>_<id>/fields.ts` or `phases.ts` you actually need — not every workflow's files
3. Never read the entire `workspace/` tree at once; a real workspace has dozens of workflow directories

## workspace/ Structure

```
workspace/
├── enums.ts           # ALL IDs: WorkflowIds, FieldIds, PhaseIds, TeamIds, GroupIds
├── workflows.ts       # Workflow registry
├── teams.ts           # Team definitions
├── groups.ts          # Group definitions
├── insights.ts        # Insight definitions
├── apps.ts            # App registry (name, url, image, members)
├── templates/         # Document templates
└── <WorkflowName>_<id>/
    ├── fields.ts      # Field definitions (type, label, key, options, required)
    ├── phases.ts      # Phases (name, key, isInitial, isEndpoint, possibleNextPhase)
    ├── main.ts        # Workflow config
    └── functions/     # Function field code (one file per function)
```

`npm run pull:force` refreshes everything from Hailer → local files.

## SDK Push Commands

| Command | Effect |
|---------|--------|
| `npm run pull:force` | Pull latest from Hailer → local files; also clones any app with a `gitUrl` into `apps/<name>_<idSuffix>/` (skips existing dirs) |
| `npm run push:force` | Push everything |
| `npm run fields-push:force` | Fields only |
| `npm run phases-push:force` | Phases only |
| `npm run workflows-sync:force` | Workflow registry (create / delete) |
| `npm run teams-push:force` | Teams |
| `npm run groups-push:force` | Groups |
| `npm run insights-push:force` | Insights |
| `npm run templates-sync:force` | Document templates |
| `npm run apps-push:force` | App registry + members |

Always use `:force` — the non-force variants prompt interactively and hang an unattended agent. This includes pull: plain `npm run pull` prompts to confirm cloning app repos whenever any app has a `gitUrl` set — `pull:force` auto-confirms the clone.

## Push / Pull Gotchas

| Gotcha | Correct | Wrong |
|--------|---------|-------|
| New entities | Omit `_id` — server assigns it | Don't add `_id` manually |
| After push | `npm run pull:force` to get server-assigned IDs | Don't assume local IDs are final |
| SDK script missing from package.json (older scaffold) | `npx hailer-sdk update-project` adds every SDK script and keeps the user's own | Don't hand-write SDK scripts |
| Function fields | `npm run fields-push:force` — function code + `functionVariables` push from `functions/` regardless of force | non-force only prompts on deletes and hangs |
| Enum imports | Verify after pull — identical hex suffixes can collide | Don't blindly trust auto-generated imports |
| `linkedfrom` fields | Don't work in isolated-vm; use `<` backlink dependency | Don't use in function fields |
| Function field code | Plain JavaScript only | Not TypeScript |
| Phase transitions | Move with the target `phaseId`, key, or unique case-insensitive phase name (`describe_workflows` / enums) — an ambiguous name errors listing the matches | Don't guess a name that doesn't exist in the workflow — check `describe_workflows` first |
| Activity field values (MCP) | Date: Unix ms (`1730937600000`), `"YYYY-MM-DD"`, or full ISO datetime; Dropdown: validated against the field's configured options (wrong value errors listing valid ones); fields keyed by field ID, key, or unique case-insensitive label | Arrays are rejected with a clear error ("Hailer fields hold one value") — not silently dropped or mis-stored |

### New-workflow pull-wipe guard

`npm run pull:force` after `npm run workflows-sync` **wipes** any locally-staged field/phase edits on other workflows. Safe sequence:

1. `npm run workflows-sync` → check CLI output for `✨ Created: N` (N ≥ 1). If N = 0, the create was a no-op — do NOT pull.
2. `npm run pull:force` — only after confirming the workflow was created.
3. Complete the new workflow end-to-end (fields-push → phases-push) before pulling for any other reason.

Never mix un-pushed field edits on existing workflows into the same batch as a new-workflow create-then-pull.

### No multi-select field types

Hailer fields hold **one value**. There is no multi-select for activitylink, dropdown (textpredefinedoptions), users, or teams. Writing `["id1", "id2"]` for any of these is a bug — MCP tools reject it up front with an explicit error ("Hailer fields hold one value — got an array") before any API call is made. To attach multiple linked activities, use multiple separate ActivityLink fields (or the inverse backlink). To assign multiple users, use multiple user fields.

## App Lifecycle

Full steps and gotchas: `create-and-publish-app` skill.

| Step | How |
|------|-----|
| Scaffold | `cd apps && npx @hailer/create-app <name> --template react-ts`, apply the 5 scaffold fixes (clear the placeholder appId, fix the StoreSet tsc error and `process.env` in App.tsx, add `--env-file ../../.env` to the publish scripts, write `.npmrc include=dev`), then `cd <name> && npm install --include=dev` — scaffold fresh, never copy an existing app |
| Local dev | `cd app && npm run dev` |
| Publish | First: `npm run publish-production -- --create --app-name "<App Name>" --workspace <wsId> --force`, then a plain `npm run publish-production -- --force` (the `--create` bundle carries the old appId). Updates: plain publish only |
| Share (after publish) | `npm run pull:force`, then edit members in `workspace/apps.ts` → `npm run apps-push:force`. NEVER create app entries in apps.ts — `--create` publish makes them (apps.ts create works mechanically but you'd have to invent the URL) |

Dev deps: Hailer Studio runs with `NODE_ENV=production`, which makes `npm install` skip devDependencies (vite/tsc) and breaks the build. Always `npm install --include=dev` in apps; scaffold fix 5 writes a `.npmrc` with `include=dev` so any bare install in the app dir is safe regardless of `NODE_ENV`.

Publish auth: works flag-free with the user API key `init` saved as `HAILER_USER_API_KEY` in the **project's `.env`** (one slot per project, not the machine-global `~/.env`); scaffold fix 4 wires each app's `publish-*` script with `--env-file ../../.env` so it publishes to its own workspace. Apps must live under `apps/<name>/` for that path to resolve. Exit 10 = no auth → set `HAILER_USER_API_KEY` in the project `.env`, or pass `-- --user-api-key <key>`; NEVER read passwords or probe login endpoints. Details: `create-and-publish-app` skill.

## When MCP Tools Are the Answer

The MCP server exposes a curated runtime surface the SDK can't replicate locally:

- **Activities**: `create_activity`, `update_activity`, `list_activities` (+ `countOnly`), `show_activity_by_id`
- **Discussions**: `list_my_discussions`, `fetch_discussion_messages` (cursor + linked-activity lookup), `add_discussion_message`, `join_discussion`, `leave_discussion`, `invite_discussion_members`
- **Calendar**: `query_events` (single / range / upcoming), `manage_calendar`, `create_event`, `update_event` (incl. attendee removal), `delete_event`, `respond_to_invite`
- **Insights (runtime)**: `run_insight` (saved or ad-hoc SQL), `save_insight`, `list_insights`
- **Files**: `upload_files`, `download_file`
- **Workflow permissions**: `set_workflow_permission` (level `none` revokes), `list_workflow_permissions`, `check_user_permissions`
- **Docs**: `search_hailer_docs` if it's in your tool list (SDK-profile connections don't serve it) — otherwise webfetch docs.hailer.com directly (`/search` endpoint, `/llms.txt` index, every page as raw `.md`)
- **Marketplace**: `browse_marketplace`, `install_marketplace` (honours `Requires:` prerequisites — `prerequisites: 'check' | 'install' | 'ignore'`), `publish_marketplace` (link related listings with `Requires:` / `Works with:` description lines — see `publish-workspace-template`)
- **Server-only mutations**: `auto_set_keys` (transactional key generation), `core_init` (live activity counts), `ensure_agent_directory` (install/repair the Agent Directory bot registry — run before creating any bot)

Tools not in this list are either SDK-shadowed (see matrix above) or admin/dangerous (handled outside this environment).

## Skills

Skills are in your skills folder. Load the relevant skill before starting that kind of work — it carries the patterns, gotchas, and correct formats for that domain.

### Skill routing

| Task / symptom | Load this skill |
|----------------|-----------------|
| Creating or editing workflows, fields, phases, teams, groups — or debugging push errors, field-not-visible issues, phase ordering | `sdk-ws-config-skill` |
| Writing or debugging any function (calculated) field; code 191 compile errors; null returns; cross-workflow aggregation | `sdk-function-fields` |
| Creating or updating activities via MCP; bulk create; field format questions; `createMany`/`updateMany`; silent write failures | `sdk-activity-patterns` |
| Writing or debugging any insight SQL query; timestamp unit confusion (seconds vs ms); reserved column names; NULL aggregates | `sdk-insight-queries` |
| Insight calculations beyond plain SUM/COUNT — weighted sums, CASE bucketing, conversion rates, date truncation, top-N, percentage of total | `sdk-insight-calculations` |
| Cross-workflow insight JOINs; NULL join results; ActivityLink display values; row multiplication from one-to-many | `insight-join-patterns` |
| Verifying MCP tool results; checking create/update actually succeeded; detecting silent failures | `tool-response-verification` |
| Building a Hailer app UI — components, hooks, reads/writes, v1↔v2 migration, ActivityLink shapes | `hailer-app-builder` |
| Scaffolding and publishing an app — `@hailer/create-app`, scaffold fixes, publish scripts, auth, marketplace app listings, git-linked apps (gitUrl) | `create-and-publish-app` |
| Publishing the workspace as a marketplace TEMPLATE — `publish_marketplace type: 'template'`, broken listing icons, private-after-publish, what transfers on install | `publish-workspace-template` |
| Theme, colors, Chakra tokens, icons, layout patterns | `hailer-design-system` |
| Adding images or media to an app | `hailer-apps-pictures` |
| Chakra UI primitives — Select, ConfirmDialog, date pickers, state machines, REST calls from app | `hailer-app-primitives` |
| Any question the local skills don't answer — API endpoint arguments/returns, RPC names, REST routes, SDK/CLI usage, end-user how-tos | `hailer-docs-search` (backed by the `search_hailer_docs` MCP tool / webfetch) |
| Creating an AI agent / bot / assistant in the workspace, writing or changing a bot's system prompt, Agent Directory, bot not answering after deploy | `provision-bot` |

### Field ids (apps)

Never hardcode hex field IDs in an app. Use the `<Workflow>_FieldIds`, `<Workflow>_PhaseIds` and `WorkflowIds` enums from `workspace/enums.ts`; `npm run pull` keeps them current.

Fields without a `key` fall back to hex ID lookup either way. Assign meaningful keys when creating fields.

## Design before building

Before building a workspace, load `hailer-workflow-archetypes` to pick the structural shape (Register, Pipeline, Header+LineItems, etc.), then `hailer-design-patterns` for parent/child lifecycle, row progression, and integration patterns. Design the structure first — flat field-piles without archetype thinking cause expensive rework later.

## Build invariants — always apply

These hold for EVERY workspace build, whatever the domain. A vague brief never suspends them — fill gaps with stated assumptions, never by skipping rules.

**Structure**
- Links are many-to-one. Header + line items = two entities, lines link to the header. Many-to-many = a bridge dataset (one record per combination, uniqueness rule stated).
- Flat reference data (products, locations, contacts) = dataset. Anything that progresses through states = phased workflow.
- Datasets CANNOT move activities between phases — phases on a dataset are dead UI groupings (pushes succeed, the UI renders them, moves silently don't exist). Status on a dataset (Active/Retired, etc.) = a dropdown field. If records genuinely progress, it's not a dataset.
- Stable descriptive keys on every workflow and field. Never reference generated hex IDs in logic or docs.
- Configuration is data, not constants: locations, categories, currencies, VAT rates, thresholds live in datasets/fields so users change them without a rebuild.
- Every new workflow/dataset name gets a fitting emoji prefix at creation. After `workflows-sync`, run `npm run workflows-covers -- <the workflows you just created>` to give them a random gradient cover, then pull. Name them explicitly, never `--all` or `--force` unless the user asks. Covers are cosmetic and best-effort: if the command fails, note it in your handoff and continue the build — never retry-loop or block on it.

**Counting money or stock**
- Append-only ledger: posted entries are never edited or deleted; corrections are reversing entries linked to the original; a transaction reverses at most once.
- Copy captured-at-posting values (cost at sale time, snapshot quantities) into the record. Never derive historical values from current data; never recompute historical COGS/totals.
- Intent does not post: an order changes nothing; the confirmation (receipt, completion) creates the ledger entries.
- Completion is idempotent — a double-click cannot post twice. Completed/posted records are locked; changes go through a controlled void/return, never an edit.

**Calculations**
- Write each formula exactly once, at the entity that owns it. Handle zero and missing inputs explicitly (divide-by-zero, missing rate, empty stock).
- Every derived value is a FUNCTION FIELD in the workspace — never computed only in app code, an insight, or left for the user. Header + line items always get BOTH: the line-level function field on every line entity (line total = qty × unit price, VAT amount, margin — load `sdk-function-fields`) AND the header rollup (backlink `<` aggregation over the lines). Line entities holding raw numbers with no computed fields = the build is not done.

**Control**
- Sensitive actions (over-receipts, threshold-crossing discounts, adjustments) need a reason field and an approval step.
- Apply workflow-level AND phase-level permissions; operational roles cannot edit posted or financial data.

**Finish line**
- Before building, write down the capability list and one acceptance check per capability. The build is done when every check passes and derived totals reconcile with their source records — not when the structure exists.

**First iteration is complete**
- A workspace build ships as a product, not a schema. The first iteration ALWAYS includes: the app (users experience the system through an app — build it unless the user explicitly declines), roles with workflow- AND phase-level permissions, the core reports/dashboard, sample data walked through the full lifecycle, and the domain-obvious safeguards (double-booking checks, over-limit approvals, duplicate prevention) — built, not offered as follow-ups.
- Offer follow-ups only for genuine extras beyond a usable product. A tidy-but-incomplete build reads as unfinished and loses the customer.

## Build strategy

Build apps yourself, end to end. Load `hailer-app-builder`, `hailer-design-system`, AND `create-and-publish-app` before starting — all three, every time. Skipping the design skill is how apps come out as generic unstyled tables.

The scaffold already ships the full Hailer design system: `src/hailer/theme/` (theme + custom colors + ~230 Hailer icons) wired into `main.tsx`, and prebuilt components (`ActivityTable`, `ActivityView`, `ActivityField`, `WorkflowList`, `DeleteAlertDialog`). Compose the UI from these — don't write raw Chakra tables/badges from scratch. Drop columns that carry no information (all rows identical, all values empty); a column you can't justify is noise.

Iterate with `npm run dev` in the app dir, then bump the version and run a plain publish to republish.
