---
title: Fields
description: Configure a workflow's fields in fields.ts — every field type, shared properties, function fields, reminders, and field modifiers.
audience: public
status: stable
tags: [sdk, configuration, fields, field-types, function-fields, reminders, modifiers]
source: hailer-sdk
generated: false
---

# Fields

A workflow's fields live in `workspace/<WorkflowName>_<id>/fields.ts`, exported as an array of
`HailerFieldGeneric`. `pull` generates the file (ids replaced with enum references), you edit
it, and `ws-config fields push` applies it via the `process.create_field` /
`process.update_field` / `process.remove_field` APIs.

```typescript
export const fields: HailerFieldGeneric[] = [
  {
    _id: "60a1...",             // existing field — keep the _id
    key: "customer_email",
    label: "Customer Email",
    type: "text",
    required: true,
  },
  {
    key: "priority",           // new field — no _id → created on push
    label: "Priority",
    type: "textpredefinedoptions",
    data: ["Low", "Medium", "High"],
  },
];
```

Fields follow the standard [sync model](./#how-push-decides-create-update-delete): no `_id`
creates, matching `_id` updates when changed, removing a field deletes it (snapshot-guarded,
prompts unless `--force`).

## Field types

`type` comes from `HailerFieldType`. It is **required when creating** a field. On update the
push explicitly drops `type` (`const { _id, type, ...fieldData } = field`), so it is
**immutable** — changing a field's type means deleting and recreating it, which may require
data migration.

| `type` | Field | Notes |
|---|---|---|
| `text` | Single-line text | |
| `textarea` | Multi-line text | |
| `textunit` | Text with a unit | Set `unit`. |
| `textpredefinedoptions` | Dropdown / select | Options in `data: string[]`. |
| `numeric` | Number | |
| `numericunit` | Number with a unit | Set `unit` (e.g. `"€"`, `"kg"`). |
| `date` | Date | |
| `datetime` | Date + time | |
| `daterange` | Date range | |
| `datetimerange` | Date + time range | |
| `time` | Time of day | |
| `timerange` | Time range | |
| `country` | Country picker | |
| `users` | User picker | |
| `teams` | Team picker | |
| `activitylink` | Link to activities in other workflows | Target workflow ids in `data`. |
| `linkedfrom` | Reverse of `activitylink` — activities linking *to* this one | |
| `subheader` | Visual section header, not a data field | Excluded from generated enums. |

## Shared properties

| Property | Type | Description |
|---|---|---|
| `type` | `HailerFieldType` | Required on create, immutable after. |
| `key` | `string?` | Stable identifier, **unique within the workflow**. It's how a field's values are referenced and queried. **Editable** — but because things reference it by value, changing a key changes what those references resolve to, so change it deliberately. |
| `label` | `string?` | Display label shown in the UI. |
| `required` | `boolean?` | Whether a value is required. |
| `description` | `string?` | Help text. |
| `placeholder` | `string?` | Placeholder text. |
| `data` | `unknown[]?` | Type-dependent: options for `textpredefinedoptions`, target workflow ids for `activitylink`. |
| `unit` | `string?` | Unit label for `numericunit` / `textunit`. |
| `defaultTo` | `boolean?` | Whether to apply `defaultValue`. |
| `defaultValue` | `unknown?` | Default value for new activities. |
| `editable` | `boolean?` | Whether users can edit the value. |
| `collapsedByDefault` | `boolean?` | Collapse the field in the UI by default. |
| `inviteToDiscussionOnChange` | `boolean?` | For `users` fields — invite the selected user to the activity discussion when the value changes. |

**Read-only** — the SDK strips these before hashing/push: `uid`, `created`, `updated`.
`_id` is the match key — retained in the local file but not sent in the update body.

Push sends only the properties that are in the file, so **deleting a line keeps the remote
value**. To clear `key`, `description`, `placeholder` or `unit`, set it to `null`.

::: tip Field enums
`enums.ts` from `pull` names a field after its `label` (falling back to `key`, then id), plus
the last 3 characters of its id. Changing a label renames the enum entry on the next pull.
:::

## Function fields

A field can compute its value from JavaScript. Enable it with `functionEnabled`, put the code
in `function`, and declare its data dependencies in `functionVariables`.

```typescript
{
  _id: "60b2...",
  key: "total_price",
  label: "Total price",
  type: "numericunit",
  unit: "€",
  functionEnabled: true,
  function: "@function:total_price_60b2",   // reference to a functions/ file (see below)
  functionVariables: {
    qty:   { type: "=", data: ["<qtyFieldId>"] },
    price: { type: "=", data: ["<priceFieldId>"] },
  },
}
```

`functionVariables` maps a variable name to a dependency (`HailerFieldFunctionVariable`):

| `type` | Dependency | `data` contains |
|---|---|---|
| `=` | A field on the current activity | field id(s) |
| `>` | An activity this one is **linked to** | field/workflow ids |
| `<` | An activity **linked from** this one | field/workflow ids |
| `?` | Workflow / phase static values | ids |

### The `functions/` directory

Function code isn't stored inline. On `pull` the SDK extracts each field's function into its
own file under `workspace/<WorkflowName>_<id>/functions/` (plus an `index.ts` there), and
writes a `main.test.ts` test template at the workflow folder root the first time. It leaves
a `@function:<name>` reference in `field.function`. On `push` it reads the file back and
inlines the function body. **Edit the code in its `functions/*.ts` file**, not in `fields.ts`.

## Reminders

Fields can trigger reminders relative to a date value.

```typescript
{
  _id: "60c3...",
  key: "due_date",
  label: "Due date",
  type: "date",
  reminderEnabled: true,
  reminderSettings: {
    fieldOffset: { milliseconds: 0, days: 1, months: 0, beforeOrAfter: "before" },
    users: ["<userId>"],
    teams: [],
    fields: [],            // notify users selected in these user-fields
    phases: [],            // only in these phases
    activityOwner: true,
    activityOwnerTeam: false,
    activityParticipants: false,
    reminderText: "This activity is due tomorrow",
  },
}
```

| `reminderSettings` key | Type | Description |
|---|---|---|
| `fieldOffset` | `{ milliseconds; days; months; beforeOrAfter: "before" \| "after" }` | When to fire, relative to the field's date. |
| `users` / `teams` | `string[]` | Explicit recipients. |
| `fields` | `string[]` | User-field ids whose selected users are notified. |
| `phases` | `string[]` | Restrict to these phases. |
| `activityOwner` / `activityOwnerTeam` / `activityParticipants` | `boolean` | Include these roles as recipients. |
| `reminderText` | `string` | The reminder message. |

## Field modifiers

`modifier` configures advanced field behaviors:

| `modifier` key | Type | Description |
|---|---|---|
| `checkbox` | `boolean?` | Render as a checkbox modifier. |
| `file` | `boolean?` | File-related modifier. |
| `matchAllFieldFilters` | `boolean?` | Require all `activityFieldFilters` to match (AND) rather than any (OR). |
| `quickAdd` | `{ targetFieldId: string; fieldIds?: string[] }` | Quick-add configuration targeting another field. |
| `activityFieldFilters` | `Array<{ targetWorkflowId; sourceFieldId; targetFieldId }>` | For `activitylink` fields — filter selectable activities by matching field values. |

## Command

`ws-config fields push` — creates, updates, and deletes fields per workflow. A field change
can trigger heavy server work (schema rebuilds, re-evaluating functions across activities), so
the SDK waits up to 30 seconds for confirmation per change and then continues in the
background; the summary flags any changes still "acknowledgement pending" so you can verify
them in the Hailer UI.
