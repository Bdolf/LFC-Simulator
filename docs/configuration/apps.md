---
title: Apps
description: Configure workspace apps in apps.ts — name, description, URL, generated icon, and members.
audience: public
status: stable
tags: [sdk, configuration, apps, icon-generator, members]
source: hailer-sdk
generated: false
---

# Apps

Workspace apps live in `workspace/apps.ts`, exported as an array of `HailerAppUpdatePayload`.
Push them with `ws-config apps push`.

```typescript
import { HailerMembers } from "./enums";

export const apps: HailerAppUpdatePayload[] = [
  {
    _id: "b0a1...",
    name: "Sales Dashboard",
    description: "Custom dashboard for the sales team",
    url: "https://dashboard.example.com",
    iconGenerator: { gradientId: "blue-purple", symbolId: "chart-column" },
    members: [
      { id: HailerMembers.Sales_abc, info: {}, permissions: [] },
      { id: HailerMembers.John_Doe_c19, info: {}, permissions: [] },
    ],
  },
  { name: "Ops Tool", url: "https://ops.example.com" },   // new — no _id → created
];
```

## Properties

Only six properties round-trip. The SDK's header comment in `apps.ts` spells out the rules:

> *When creating a new app, don't set `_id` — it will be assigned by Hailer. Configuration
> fields can be added and edited only via the app's `manifest.json` file. To remove all
> members from an app, set `members` to an empty array `[]`.*

| Property | Type | Description |
|---|---|---|
| `name` | `string` | App name. Required by the API on update. |
| `description` | `string` | App description. Clear it with `""`; the API rejects `null`. |
| `url` | `string` | App URL. |
| `iconGenerator` | `{ gradientId; symbolId }` | Icon recipe — the server renders the icon from a gradient + a symbol (see below). |
| `gitUrl` | `string \| null` | Optional URL of the app's source repository (see below). `null` clears it remotely; omitting the key leaves the remote value untouched. |
| `members` | `Array<{ id, info, permissions }>` | Users/teams/groups with access. `id` is a prefixed member id (use the `HailerMembers` enum). Set `[]` to remove everyone. `permissions` is ignored: the API saves every member with `[]` and has no way to set it. |

**Read-only / never sent** (stripped before push): `cid`, `uid`, `created`, `updated`,
`packageHash`, `config`, `enabled`, `allowedUrls`, `isProductVersionAvailable`, `type`, the
server-rendered `icon` / `iconBadge`, and the deprecated `image`. `_id` is the match key —
retained in the local file but not sent in the update body. In particular, `config` is
managed through the app's `manifest.json`, not here, and `enabled` is not controlled from
the SDK.

## App icons (`iconGenerator`)

Icons are generated server-side from a **recipe**: a background `gradientId` plus a glyph
`symbolId`. The rendered `icon`/`iconBadge` files are read-only and stripped on pull — you only
set the recipe. If you omit `iconGenerator` when creating an app, the server picks a random
recipe.

**`gradientId`** — one of: `blue-purple`, `purple-pink`, `pink-orange`, `orange-amber`,
`teal-blue`, `indigo-purple`, `red-pink`, `sky-indigo`, `cyan-green`, `amber-red`, `lime-teal`,
`slate-blue`.

**`symbolId`** — a Lucide glyph id, one of: `chart-column`, `chart-spline`, `chart-pie`,
`database`, `square-function`, `file`, `folder`, `notebook`, `book-open-text`, `list-checks`,
`calendar-clock`, `wrench`, `cable`, `microscope`, `telescope`, `zap`, `globe`, `key-round`,
`key-square`, `mail`, `info`, `music-4`, `shopping-cart`, `home`, `factory`, `briefcase`,
`rocket`, `truck`, `ship`, `sailboat`, `ship-wheel`, `traffic-cone`, `ghost`, `panda`, `rat`,
`leaf`, `sprout`, `flame`, `droplet`, `rainbow`, `umbrella`, `beer`, `utensils`, `carrot`,
`chef-hat`, `heart`, `sparkles`, `wand-sparkles`, `crown`, `gem`, `target`, `puzzle`, `spade`,
`shield`, `life-buoy`.

The `AppIconGradientId` / `AppIconSymbolId` union types in `hailer.d.ts` enforce these at
author time, so your editor autocompletes and type-checks them. They mirror the live
`v3.app.icon.options` endpoint.

## Source repository (`gitUrl`) & cloning

An app can have an optional `gitUrl` pointing at its source repository. It appears in `apps.ts` on pull and can be modified with `apps push`.

Its purpose is on **pull**: when the workspace has apps with a `gitUrl`, pull offers to clone
them into an `apps/` directory at the **project root** (not under `workspace/`, so pull's
workflow-directory cleanup never touches them). Each is cloned into
`apps/<name>_<idSuffix>/`. Existing directories are **skipped, never overwritten** — your local
work is safe. `--force` skips the confirmation and clones non-interactively (`npm run pull:force`) —
use it in scripts, CI, or any non-interactive shell where the prompt can't be answered.

::: tip Give every app its own repository
The recommended setup is one **dedicated git repository per app**: the workspace-config
project tracks configuration, each app repo tracks that app's source. Create a repo for the
app, push its code there, and set the repo URL as the app's `gitUrl` (in `apps.ts` + push,
or directly in Hailer). Every teammate
who runs `pull` then gets the app source cloned automatically — versioned and reviewed in its
own repo, at its own pace.

For the same reason, `apps/` is **git-ignored** in projects created by `hailer-sdk init`: the
cloned directories are full git repositories, and committing them into the workspace-config
repo would only record broken gitlink pointers instead of the code. If your project predates
this, add `apps/` to your `.gitignore` yourself.
:::

## How create & update work

- **Create** (`_id` absent) calls `v3.app.create` with `name`, `description`, `url`,
  `iconGenerator`, `gitUrl`, then applies `members`.
- **Update** calls `v3.app.update` with `name`, `description`, `url`, `iconGenerator`,
  `gitUrl`, and reconciles `members` via `v3.app.member.add` / `.remove`.

## Command

`ws-config apps push` — creates, updates, and deletes apps (deletions snapshot-guarded, prompt
unless `--force`).
