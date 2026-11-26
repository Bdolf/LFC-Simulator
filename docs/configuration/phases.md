---
title: Phases
description: Configure a workflow's phases in phases.ts — order, transitions, colors, phase fields, announcements, and webhooks.
audience: public
status: stable
tags: [sdk, configuration, phases, transitions, announcements, webhooks]
source: hailer-sdk
generated: false
---

# Phases

A workflow's phases live in `workspace/<WorkflowName>_<id>/phases.ts`, exported as an array of
`HailerPhaseUpdatePayload`. `ws-config phases push` applies them via `phase.create` /
`phase.update` / `phase.remove`.

```typescript
export const phases: HailerPhaseUpdatePayload[] = [
  { _id: "70a1...", name: "Lead", isInitial: true, color: "#3498db" },
  { _id: "70a2...", name: "In Progress" },
  { name: "Done", isEndpoint: true },   // new phase — no _id → created on push
];
```

Phase order is set by `phasesOrder` in [`main.ts`](./workflows#ordering) and pushed with
`workflows push`; the order of the entries in `phases.ts` is ignored. Removing a phase deletes it (snapshot-guarded,
prompts unless `--force`). New phases (no `_id`) are created empty via `phase.create`, then all
their properties are applied in a follow-up `phase.update`.

Push sends only the properties that are in the file, so **deleting a line keeps the remote
value**. To clear `color`, `key`, `description`, `primaryDateField`, `primaryNumericField` or a
`fieldOptions` entry, set it to `null`.

## Properties

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Phase name. |
| `description` | `string?` | Phase description. |
| `color` | `string?` | Phase color (hex). |
| `key` | `string?` | Custom stable identifier. |
| `isInitial` | `boolean?` | The entry phase for new activities. |
| `isEndpoint` | `boolean?` | A terminal/completed phase. |
| `fields` | `string[]?` | Field ids shown while an activity is in this phase. |
| `possibleNextPhase` | `string[]?` | Phase ids an activity may move to from here. |
| `possibleNextPhaseSettings` | `Record<string, { text?; name?; description? }>` | Per-transition labels/config, keyed by target phase id. |
| `primaryDateField` | `"created" \| "updated" \| "completedOn"` | Which date drives calendar/timeline placement. |
| `primaryNumericField` | `string?` | Field id used as the phase's primary numeric metric. |
| `followers` | `string[]?` | User ids that follow activities in this phase. |

### Announcements

| Property | Type | Description |
|---|---|---|
| `enableAnnouncement` | `boolean?` | Post a feed announcement when activities enter this phase. |
| `announcementFields` | `string[]?` | Field ids included in the announcement. |
| `announcementFieldsOrder` | `string[]?` | Order of those fields. |
| `announcementRecipients` | `string[]?` | Explicit recipients as prefixed ids (`user_…`, `team_…`, `group_…`, `network_…`); use the `HailerMembers` enum. |
| `announcementToOwner` | `boolean?` | Notify the activity owner. |
| `announcementToOwnerTeam` | `boolean?` | Notify the owner's team. |
| `announcementAllowPrivateReply` | `boolean?` | Allow private replies to the announcement. |

### Field options & webhooks

| Property | Type | Description |
|---|---|---|
| `fieldOptions` | `{ eventDateField?: string; tableDeadlineField?: string }` | Field ids used as the event date and the table deadline for this phase. |
| `webhooksEnabled` | `boolean?` | Fire a webhook when activities enter this phase. |
| `webhookUrl` | `string?` | Webhook target URL. |

### Members (restricted phases)

| Property | Type | Description |
|---|---|---|
| `members` | `HailerPhaseMember[]?` | Phase members. A phase with a non-empty list is **restricted**: only the listed members (plus workflow admins) can access activities in it. An empty list keeps the phase open to everyone with workflow access. |

Each entry is `{ id, info, permissions }`:

- `id` — `user_…`, `team_…`, `group_…`, or `network_…`; use the `HailerMembers` enum from `enums.ts`.
- `info` — server-managed, keep as `{}`.
- `permissions` — `[]` (member can see the phase) or `["edit"]`; `edit` is the only
  phase-level permission.

`phase.update` doesn't accept `members`, so `phases push` reconciles the local list against
the remote one through the dedicated endpoints (`v2.process.phase.member.add/remove`,
`v2.process.phase.permissions.grant/deny`). Removing an entry removes that member remotely;
removing the **last** entry makes the phase unrestricted again. Deleting the whole
`members` key means "leave membership untouched".

```ts
members: [
  { id: HailerMembers.Engineering_abc123, info: {}, permissions: ["edit"] },
  { id: HailerMembers.John_Doe_def456, info: {}, permissions: [] },
],
```

## Read-only / managed by the server

The SDK strips these before writing `phases.ts` and before hashing — editing them has no
effect:

- `uid`, `created`. `_id` is the match key — retained in the local file but not sent in the update body.
- `order` — position is controlled by `phasesOrder` in `main.ts`, not this field.
- `webhookAdded`, `webhookUpdated` — server-managed webhook state.

## Command

`ws-config phases push` — creates, updates, and deletes phases per workflow.
