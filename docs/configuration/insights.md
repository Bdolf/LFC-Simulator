---
title: Insights
description: Configure workspace insights in insights.ts — SQL-like reports over workflow data, their sources, query, members, and visibility.
audience: public
status: stable
tags: [sdk, configuration, insights, reports, query, sources, members]
source: hailer-sdk
generated: false
---

# Insights

Insights are SQL-like reports over your workflow data. They live in `workspace/insights.ts`,
exported as an array of `HailerInsightPayload`. Push them with `ws-config insights push`.

```typescript
import { HailerMembers } from "./enums";

export const insights: HailerInsightPayload[] = [
  {
    _id: "a0a1...",
    name: "Open deals by phase",
    public: false,
    query: "SELECT phaseName, COUNT(*) FROM sales GROUP BY phaseName",
    sources: [
      {
        workflowId: "abc123",
        name: "sales",                       // table alias used in the query
        fields: [
          { name: "phaseName", meta: "phaseName" },
          { name: "value", fieldId: "<fieldId>" },
        ],
      },
    ],
    members: [{ id: HailerMembers.John_Doe_c19, info: {}, permissions: [] }],
  },
];
```

## Properties

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Insight name. |
| `public` | `boolean` | Whether the insight is publicly accessible (via `publicKey`). |
| `query` | `string` | The report query. Uses **SQLite3** syntax over the `sources`. |
| `sources` | `Source[]` | One or more workflows the query reads from (see below). |
| `members` | `Member[]` | Who can view the insight. |

**Read-only** (stripped before push): `created`, `updated`, `publicKey`, `uid`, `cid`, and
`presets` (server-managed — not written to the file, and a `presets`-only change is not
detected as a change). `_id` is the match key — retained in the local file but not sent in
the update body.

### Sources

Each source maps a workflow into a named table your `query` can select from:

```typescript
{
  workflowId: "abc123",
  name: "sales",            // alias referenced in the SQL query
  fields: [
    { name: "value",     fieldId: "<fieldId>" },  // a workflow field → column "value"
    { name: "phase",     meta: "phaseName" },      // built-in metadata → column "phase"
    { name: "createdBy", meta: "createdBy" },
  ],
}
```

Each field entry has a column `name`, plus **either** a `fieldId` (a workflow field), a
`phaseId`, or a `meta` selector for built-in activity metadata. `meta` accepts: `_id`, `uid`,
`team`, `createdBy`, `name`, `created`, `updated`, `phaseId`, `phaseName`, `phaseLastMove`,
`workflowId`, `workflowName`, `priority`.

### Members

```typescript
members: [
  { id: HailerMembers.John_Doe_c19, info: {}, permissions: [] },
  { id: HailerMembers.Sales_Team_abc, info: {}, permissions: [] },
]
```

`id` is a prefixed member id (use the `HailerMembers` enum). Members can **view** the insight.
`permissions` is ignored: the API saves every member with `[]` and has no way to set `edit`.
Only workspace admins can create, edit or delete insights.

## How create & update work

- **Create** (`_id` absent) calls `v3.insight.create` with `name`, `public`, `sources`,
  `query`, then adds each member.
- **Update** calls `v3.insight.update` with `name`, `public`, `sources`, `query` (and
  `presets`), and reconciles members with `v3.insight.member.add` / `.remove` — so adding or
  removing an `id` from `members` adds/revokes access.

## Command

`ws-config insights push` — creates, updates, and deletes insights (deletions snapshot-guarded,
prompt unless `--force`).
