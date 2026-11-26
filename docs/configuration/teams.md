---
title: Teams
description: Configure workspace teams in teams.ts — name, description, visibility, default view, and members.
audience: public
status: stable
tags: [sdk, configuration, teams, members, default-view]
source: hailer-sdk
generated: false
---

# Teams

Workspace teams live in `workspace/teams.ts`, exported as an array of
`HailerTeamUpdatePayload`. Push them with `ws-config teams push`.

```typescript
import { WorkspaceMembers } from "./enums";

export const teams: HailerTeamUpdatePayload[] = [
  {
    _id: "80a1...",
    name: "Sales",
    description: "The sales team",
    public: true,
    members: [WorkspaceMembers.John_Doe_c19, WorkspaceMembers.Jane_Roe_a42],
  },
  { name: "Support" },   // new team — no _id → created on push
];
```

## Properties

The SDK's own header comment in `teams.ts` is the contract:

> *Properties that can be set when updating or creating a new team: `name`, `description`,
> `public`, `defaultView`, `members`.*

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Team name. |
| `description` | `string?` | Team description. |
| `public` | `boolean?` | Whether the team is publicly visible in the workspace. |
| `defaultView` | `{ type: "app" \| "hailer" \| "custom"; value: string }` | The team's default landing view (e.g. `value` of `"discussions"`, `"feed"`, `"events"`, `"activities"`). |
| `members` | `string[]` | User ids. `pull` writes them as `WorkspaceMembers` enum references. |

**Read-only** (stripped before push): `cid`, `uid`, `created`, `updated`, and the deprecated
`accounts`. `_id` is the match key — retained in the local file but not sent in the update
body (the client passes it separately, renamed as `team_id`).

## How create & update work

- **Create** (`_id` absent) calls `company.new_team` with just `name` and `description`, then
  a follow-up update applies `public`, `defaultView`, and `members`.
- **Update** applies each changed section independently via `company.set_team_data`
  (`name` / `description` / `public` / `defaultView`) and `company.update_team_users`
  (`members`).

::: warning Members can't be emptied via the SDK
Members are only pushed when the `members` array is **non-empty**. Setting `members: []` skips
the member update rather than removing everyone — remove the last members in the Hailer UI.
:::

::: tip Authentication and workspace switching
With email/password auth the SDK first switches into the target workspace
(`core.switch_ecosystem`) so the team's `cid`/`uid` resolve correctly. A user-API-key session
cannot switch workspace, so run team operations against the key's own workspace.
:::

## Command

`ws-config teams push` — creates, updates, and deletes teams (deletions snapshot-guarded,
prompt unless `--force`).
