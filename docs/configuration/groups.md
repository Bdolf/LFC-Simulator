---
title: Groups
description: Configure workspace groups in groups.ts — hierarchical membership of users, teams, and other groups.
audience: public
status: stable
tags: [sdk, configuration, groups, members, hierarchy]
source: hailer-sdk
generated: false
---

# Groups

Workspace groups live in `workspace/groups.ts`, exported as an array of
`HailerGroupUpdatePayload`. Push them with `ws-config groups push`. A group is a
**hierarchical** container: it can hold users, teams, and other groups.

```typescript
import { WorkspaceMembers, WorkspaceTeams, WorkspaceGroups } from "./enums";

export const groups: HailerGroupUpdatePayload[] = [
  {
    _id: "90a1...",
    name: "Leadership",
    description: "Managers and leads",
    public: false,
    users: [WorkspaceMembers.John_Doe_c19],
    teams: [WorkspaceTeams.Sales_abc],
    groups: [WorkspaceGroups.Admins_xyz],
  },
  { name: "Reviewers", users: [WorkspaceMembers.Jane_Roe_a42] },   // new — no _id → created
];
```

## Properties

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Group name. |
| `description` | `string?` | Group description. |
| `public` | `boolean?` | Whether the group is publicly visible. |
| `users` | `string[]` | Member user ids (written as `WorkspaceMembers` enum refs). |
| `teams` | `string[]` | Member team ids (written as `WorkspaceTeams` enum refs). |
| `groups` | `string[]` | Nested group ids (written as `WorkspaceGroups` enum refs). |

**Read-only** (stripped before push): `cid`, `uid`, `created`, `updated`. `_id` is the match
key — retained in the local file but not sent in the update body (the client passes it
separately, renamed as `groupId`).

## Create vs. update — a key difference for `teams`

The SDK's header comment in `groups.ts` states it outright:

> *When creating a new group, the `teams` property cannot be set — it can be updated later
> after group creation. Properties that can be set when creating a new group: `name`,
> `description`, `public`, `users`, `groups`.*

- **Create** (`_id` absent) makes a **single** `network.group.create` call with `name`,
  `description`, `public`, and an initial member list built from **`users` and `groups` only**.
  Unlike teams/phases/apps, there is **no follow-up update call** after creating a group — so
  any `teams` you list are simply not applied at creation time.
- **Update** calls `network.group.set` (name / description / public) and then
  `network.group.update` with the full membership — **including `teams`** — using a reset map
  (`{ "*": null, ... }`), so on update the member list (users, teams, groups) is set exactly to
  what you declare. Unlike teams, an empty membership **can** be applied on update.

So to create a group that contains teams: add it (without `_id`), `push`, `pull`, then add the
`teams` and push again — the second push goes through the update path, which does apply teams.

## Command

`ws-config groups push` — creates, updates, and deletes groups (deletions snapshot-guarded,
prompt unless `--force`).
