---
title: Document templates
description: Configure a workflow's document templates — the templates.ts registry, per-template config (field mappings + options), and the PDF/CSV generation code.
audience: public
status: stable
tags: [sdk, configuration, templates, documents, pdf, csv, field-map]
source: hailer-sdk
generated: false
---

# Document templates

Document templates generate PDF or CSV documents from a workflow's activities. They're
configured across three kinds of file inside a workflow folder:

```
<WorkflowName>_<id>/
├── templates.ts                         # registry — which templates exist (create/delete)
└── templates/
    └── <TemplateName>_<id>/
        ├── template.config.ts           # metadata, options, field mappings
        └── template.code.ts             # the PDF/CSV generation function
```

Templates only appear for workflows that have them. Two commands manage them:
`ws-config templates sync` creates/deletes templates from the registry;
`ws-config templates push` updates each template's config and code.

## `templates.ts` — the registry

```typescript
export const templates: DocumentTemplateEntry[] = [
  { templateId: "c0a1...", name: "Invoice", fileType: "pdf", folder: "Invoice_c0a1" },
  { name: "Export", fileType: "csv" },   // new — no templateId → created on sync
];
```

| Property | Type | Notes |
|---|---|---|
| `templateId` | `string?` | Present for existing templates. **Omit to create.** Never change it — it's used to match the template to its remote counterpart. |
| `name` | `string` | Template name. |
| `fileType` | `"pdf" \| "csv"` | Output type. Set at creation. |
| `folder` | `string?` | Local folder name; auto-generated on `pull`. |

> On create, **only `name` and `fileType` can be set** (per the registry's header comment).
> `sync` creates the template server-side with placeholder content, then `pull` generates its
> `template.config.ts` and `template.code.ts` for you to fill in. `templateId` is the match key
> and must never change.

**Create:** add an entry without `templateId`, run `templates sync`, then `pull`.
**Delete:** remove its entry and run `templates sync` (snapshot-guarded, prompts unless
`--force`).

## `template.config.ts` — metadata, options & field mappings

Exports a `DocumentTemplateUpdatePayload`. `content` is a `@function:<name>` reference to the
code file — don't edit it by hand.

```typescript
import { Invoice_FieldIds, Company_FieldIds } from "../../../enums";

export const template: DocumentTemplateUpdatePayload = {
  templateId: "c0a1...",
  name: "Invoice",
  fileType: "pdf",
  description: "Invoice generated from an activity",
  content: "@function:invoice_c0a1",
  order: 0,
  opts: {
    formatFieldValue: true,
    thousandSeparator: " ",
    decimalSeparator: ",",
    toFixedDigits: "2",
    toFixedIds: "",
  },
  fieldMap: {
    staticActivityIds: "",
    images: {
      image1: { value: "67640282d1346d04eacf4b05", description: "Company logo" },
    },
    activityLinks: {},
    fields: {
      field1: { label: "Invoice number", value: `::${Invoice_FieldIds.invoice_number_abc}`, description: "" },
      field2: { label: "Customer",       value: `::${Invoice_FieldIds.customer_def}/::${Company_FieldIds.name_xyz}`, description: "Linked company name" },
    },
  },
};
```

### `opts` (`DocumentTemplateOptions`)

| Option | Type | Description |
|---|---|---|
| `formatFieldValue` | `boolean` | Apply number/date formatting to field values. |
| `thousandSeparator` | `"" \| " " \| ","` | Thousands separator. |
| `decimalSeparator` | `"." \| ","` | Decimal separator. |
| `toFixedDigits` | `"" \| "0" \| "1" \| "2" \| "3"` | Fixed decimal places. |
| `toFixedIds` | `string` | Which field ids the fixed-digit rule applies to. |
| `linkedActivitiesFilteredPhases` | `string?` | Restrict linked-activity data to these phases. |

### `fieldMap`

Defines the data slots the template code renders. Four sections:

| Section | Shape | Purpose |
|---|---|---|
| `fields` | `{ [key]: { value?; label?; description? } }` | Text/number slots pulled from activity fields. |
| `images` | `{ [key]: { value?; description? } }` | Image slots; `value` is an image asset id. |
| `activityLinks` | `{ [key]: { field?; label?; process?; description? } }` | Slots that pull from linked activities. |
| `staticActivityIds` | `string` | Fixed activity ids the template always reads from. |

**Field value patterns** (in `fields[*].value`):

| Pattern | Resolves to |
|---|---|
| `::fieldId` | The field's value on the current activity. |
| `::fieldId/::otherFieldId` | A field on a **linked** activity (follow the first link, read the second field). |
| `` `::${Workflow_FieldIds.field}` `` | The same, via a generated enum (what `pull` writes). |

::: warning `fieldMap` key order is significant
The keys (`field1`, `field2`, …) determine **column/section order** in the generated document.
`pull` deliberately preserves their order instead of sorting them — keep them in the order you
want them to render.
:::

## `template.code.ts` — the generation function

Holds the PDF/CSV generation code (referenced by `content`). It receives the activity context
(`activity`, `process`, `fieldMap`) and builds the document — e.g. a `setPdfDefinition()` that
pushes content blocks referencing `this.fieldMap.fields.field1.value`. Edit the logic here;
`push` reads this file back and sends it as the template's `content`.

## How push applies changes

`ws-config templates push` splits each template in two:

- **Metadata** (`name`, `order`, `opts`, `fieldMap`, `templateId`) → `process.set_documentTemplate`.
- **Code** (`templateId`, `description`, `global`, `fileType`, `content` from `template.code.ts`)
  → `v3.template.update`.

Both go out in a single push per template, guarded by the usual
[snapshot/conflict model](./#how-push-decides-create-update-delete).

## Commands

- `ws-config templates sync` — create/delete templates from `templates.ts`.
- `ws-config templates push` — update each template's config + code.
