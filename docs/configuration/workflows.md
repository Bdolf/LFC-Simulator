---
title: Workflows
description: Configure workflows — the workflows.ts registry that creates and deletes workflows, and each workflow's main.ts settings.
audience: public
status: stable
tags: [sdk, configuration, workflows, main.ts, workflows.ts, dataset, name-function, translations, i18n]
source: hailer-sdk
generated: false
---

# Workflows

Workflows (called *processes* internally) are configured in two places:

- **`workspace/workflows.ts`** — the registry that decides **which workflows exist**.
  `ws-config workflows sync` creates and deletes workflows from it.
- **`workspace/<WorkflowName>_<id>/main.ts`** — one workflow's **settings**.
  `ws-config workflows push` updates them via the `process.set_info` API.

Creating/deleting a workflow (the registry) is separate from editing its settings (`main.ts`)
because they hit different endpoints and have very different blast radius.

## `workflows.ts` — the registry

`pull` generates this file with one entry per workflow (`WorkflowEntry`):

```typescript
export const workflows: WorkflowEntry[] = [
  { _id: "abc123", name: "Sales Pipeline", enableUnlinkedMode: false, folder: "Sales_Pipeline_abc123" },
  { name: "Customer Support" },                       // new — omit _id to create on sync
  { name: "Contacts", enableUnlinkedMode: true },     // create as a dataset, not a workflow
];
```

| Property | Type | Notes |
|---|---|---|
| `_id` | `string?` | Present for existing workflows. **Omit to create.** Never change it. |
| `name` | `string` | Workflow name. Required. |
| `enableUnlinkedMode` | `boolean?` | `true` creates a **dataset** (unlinked mode) instead of a pipeline workflow. |
| `folder` | `string?` | Local folder name; auto-generated on `pull`. |

> The entry is spread into the `process.create` call, so all properties on it (`name`,
> `enableUnlinkedMode`, `folder`) are sent on sync. Every other setting is configured
> afterwards in `main.ts` via `workflows push`.

**Create** a workflow by adding an entry without `_id`, then run `workflows sync` and `pull`
— the SDK creates it, assigns the id, and generates its `<WorkflowName>_<id>/` folder.
**Delete** by removing its entry and running `workflows sync` (snapshot-guarded, prompts
unless `--force`). Never hand-create or delete workflow folders — `pull` manages them — and
never change the `_id` inside a folder name.

## `main.ts` — workflow settings

`pull` writes `main.ts` as a single `HailerWorkflowUpdatePayload` object, generated from the
workflow **minus its fields, phases, and server-managed properties**. Ids inside it are
replaced with enum references from `../enums` (e.g. `WorkspaceMembers.John_Doe_c19`).

```typescript
import { WorkspaceTeams, WorkspaceMembers } from "../enums";

export const workflowConfig: HailerWorkflowUpdatePayload = {
  _id: "abc123",
  name: "Sales Pipeline",
  description: "Track deals from lead to close",
  defaultView: "kanban",
  // ...settings below
};
```

`_id` is required for matching but not sent in the update body. On push everything else is
sent to `process.set_info`, so all the settings below are editable.

Push sends only the settings that are in the file, so **deleting a line keeps the remote
value**. To clear `description`, `key`, `color`, `nameColumnText`, `nameFieldPlaceHolderText`,
`initPhaseDescription`, `personInCharge`, `personInChargeLabel`, `predefinedNamePrefix`,
`ownerTeamFieldTitle` or `defaultGroupByField`, set it to `null`. The translatable ones
(`description`, `nameColumnText`, `nameFieldPlaceHolderText`, `initPhaseDescription`,
`personInChargeLabel`, `predefinedNamePrefix`, `ownerTeamFieldTitle`) also have a copy in
`translations.<locale>`: remove it there too, or Hailer keeps showing the translation (see
[Translations](#translations)).

### Core

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Workflow name. |
| `description` | `string?` | Workflow description. |
| `defaultView` | `"table" \| "kanban" \| "wall" \| "calendar"` | View shown when the workflow opens. |
| `order` | `number?` | Sort order in the workflow list. |
| `coverImage` | `string?` | File id of a cover image. `hailer-sdk ws-config workflows covers` generates and sets one. |
| `key` | `string?` | Custom unique identifier for the workflow. |

### Ordering

| Property | Type | Description |
|---|---|---|
| `fieldsOrder` | `string[]` | Field ids in display order. Reorder here to reorder fields. |
| `phasesOrder` | `string[]` | Phase ids in display order. |

Field/phase *definitions* live in [`fields.ts`](./fields) / [`phases.ts`](./phases); only
their **order** is set from `main.ts`.

### Members & permissions

```typescript
members: [
  { id: HailerMembers.Sales_Team_abc, info: {}, permissions: ["any"] },
  { id: HailerMembers.John_Doe_c19,   info: {}, permissions: ["own"] },
]
```

`members` is an array of `HailerMember`. Each `id` is prefixed (`user_`, `team_`, `group_`,
`network_`) — use the generated `HailerMembers` enum. `permissions` is drawn from:

| Permission | Meaning |
|---|---|
| `any` | Any activity in the workflow. |
| `own` | Only activities they own. |
| `ownteam` | Only activities owned by their team. |
| `admin` | Full administrative control of the workflow. |

### Feature flags

| Flag | Enables |
|---|---|
| `enableUnlinkedMode` | Dataset mode (activities aren't linked into a pipeline). |
| `enableMessenger` | Per-activity discussion/messenger. |
| `enableAttachments` | File attachments on activities. |
| `enableMapLocation` | Location field / map view. |
| `enableUniqueName` | Enforce unique activity names. |
| `enableOwnerField` | Show an activity owner field. |
| `enableOwnerTeamField` | Show an owner-team field (label via `ownerTeamFieldTitle`). |
| `enableAddedField` | Show the created-timestamp field. |
| `enableModifiedField` | Show the updated-timestamp field. |
| `enableLinkedAnnouncements` | Receive announcements when linked activities change. |
| `enablePreselectedTeam` | Preselect a team on new activities (see `preselectedTeam`). |
| `enableGuestEditing` | Let guests edit (requires `allowGuests`). |
| `enablePredefinedName` | Use a predefined name prefix (`predefinedNamePrefix`). |

### Activity name

| Property | Type | Description |
|---|---|---|
| `nameEditable` | `boolean?` | Whether users can edit the activity name. |
| `nameColumnText` | `string?` | Header text for the name column. |
| `nameFieldPlaceHolderText` | `string?` | Placeholder in the name field. |
| `createNewLabel` | `string?` | Label on the "create new" button. |
| `predefinedNamePrefix` | `string?` | Prefix used when `enablePredefinedName` is on. |
| `nameFunctionEnabled` | `boolean?` | Generate the activity name from code. |
| `nameFunction` | `string?` | JavaScript that returns the activity name. |
| `nameFunctionVariables` | `Record<string, HailerFieldFunctionVariable>` | Field dependencies for `nameFunction` (see [Fields → Function fields](./fields#function-fields)). |

### Teams, guests & people

| Property | Type | Description |
|---|---|---|
| `allowGuests` | `boolean?` | Allow guest access. |
| `preselectedTeam` | `{ team; account }` | Team preselected on new activities. `pull` may return `null`; push normalizes `null` → unset. |
| `personInCharge` | `string?` | Default person-in-charge user id. |
| `personInChargeLabel` | `string?` | Custom label for person-in-charge. |
| `ownerTeamFieldTitle` | `string?` | Label for the owner-team field. |
| `initPhaseDescription` | `string?` | Title used for new-activity feed announcements. |
| `discussionPermissions` | `DiscussionPermission[]?` | Per-activity discussion permissions. |

### Translations

Workflow UI texts can be translated per locale (`en`, `fi`, `sv`) via the `translations`
map. `pull` writes it into `main.ts` when the workflow has translations remotely;
`workflows push` applies local changes. Field and phase ids appear as enum keys:

```typescript
translations: {
  fi: {
    name: "Liidit",
    createNewLabel: "Uusi liidi",
    fields: {
      [Leads_FieldIds.status_c19]: { label: "Tila", placeholder: "Valitse tila" },
    },
    phases: {
      [Leads_PhaseIds.new_4a2]: { name: "Uusi" },
    },
  },
  sv: { /* ... */ },
},
```

Accepted keys per locale (max lengths enforced by the API — anything else is rejected,
so e.g. predefined-option values (`data`) are **not** translatable):

| Level | Keys |
|---|---|
| Workflow | `name` (160), `description` (4096), `nameColumnText` (64), `nameFieldPlaceHolderText` (128), `createNewLabel` (96), `personInChargeLabel` (128), `predefinedNamePrefix` (32), `initPhaseDescription` (128), `ownerTeamFieldTitle` (64) |
| `fields.<fieldId>` | `label` (544), `unit` (32), `placeholder` (320), `description` (1664), `defaultValue` (352) |
| `phases.<phaseId>` | `name` (96), `description` (768, longer is cut off), `possibleNextPhaseSettings.<phaseId>.text` (128) |

How push applies translations:

- **The local map is a full replace.** It overwrites the remote map entirely — removing a locale, field, or phase entry from `main.ts` **deletes that translation remotely** on push.
- **Delete-all is deliberately not supported.** When `translations` is absent or empty locally, push skips them entirely, so a `main.ts` from before translations support (or a workflow that never had translations) can never wipe the remote map.
- **Keep the default locale in sync with the base settings.** Hailer shows the translation value when present and falls back to the base setting otherwise.
- **Translations take precedence.** Push sends `translations` after the base settings, so when `translations.<defaultLocale>` differs from a base setting, the translation is kept. This applies to every translatable workflow setting: `name`, `description`, `nameColumnText`, `nameFieldPlaceHolderText`, `createNewLabel`, `personInChargeLabel`, `predefinedNamePrefix`, `initPhaseDescription` and `ownerTeamFieldTitle`. Renaming only `name` leaves the old name in `translations.en.name`, and clearing only `nameColumnText` with `null` leaves the old text in `translations.en.nameColumnText`; Hailer keeps showing the translation — change both.

### Also accepted (not populated on pull)

`HailerWorkflowUpdatePayload` additionally accepts these — `pull` doesn't write them, but you
can add them to `main.ts` and they'll be sent to `process.set_info`: `locationRequired`,
`tags`, `allowMultipleTags`, `allowCustomTags`, `requireFileTag`, `defaultGroupByField`,
`color`, `activityTaggingPhaseIds`.

### Read-only / managed elsewhere

Not present in `main.ts` (the SDK strips them before writing and before hashing) — editing
them here has no effect:

- System: `cid`, `uid`, `created`, `updated`, `version`, `isStarred`. `_id` is the match key — retained in the local file but not sent in the update body.
- `fields` / `phases` — edit in [`fields.ts`](./fields) / [`phases.ts`](./phases).
- `documentTemplates` — edit via [templates](./templates).
- `publicForm`, `workflowSuite`, `phasesRemoved`, `createdActivities`,
  `groupNames`, `enableActivityTagging`, `autoPickPreselectedTeam`.

## Commands

- `ws-config workflows sync` — create/delete workflows from `workflows.ts`.
- `ws-config workflows push` — update `main.ts` settings (never creates or deletes
  workflows; note that the `translations` map is replaced wholesale — see [Translations](#translations)).

See the [sync model](./#how-push-decides-create-update-delete) for how changes are applied.
