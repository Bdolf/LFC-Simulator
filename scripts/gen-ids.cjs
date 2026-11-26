/** Generoi apps/lfc-ro-simulator/src/sim/ids.ts workspace/enums.ts:stä. */
const fs = require('fs');
const src = fs.readFileSync('workspace/enums.ts', 'utf8');

const byGroup = {};
const enumRe = /export enum (\w+) \{([^}]+)\}/g;
let m;
while ((m = enumRe.exec(src)) !== null) {
  const group = m[1].replace(/_(FieldIds|PhaseIds)$/, '');
  if (['HailerMembers', 'WorkspaceTeams', 'WorkspaceMembers', 'WorkspaceGroups', 'WorkspaceCredentialIds', 'GroupIds'].includes(group)) continue;
  if (!byGroup[group]) byGroup[group] = [];
  const memberRe = /(\w+)\s*=\s*"([0-9a-f]+)"/g;
  let mm;
  while ((mm = memberRe.exec(m[2])) !== null) byGroup[group].push([mm[1], mm[2]]);
}

const strip = (k) => k.replace(/_[0-9a-f]{3}$/, '');
let out = '/** GENEROITU workspace/enums.ts:stä — älä muokkaa käsin. Aja: node scripts/gen-ids.cjs */\n\n';
out += 'export const WF = {\n';
for (const [k, v] of byGroup['WorkflowIds'] || []) out += `  ${strip(k)}: '${v}',\n`;
out += '} as const;\n\n';
for (const [group, items] of Object.entries(byGroup)) {
  // group on joko 'X' (workflowIds) tai 'X_Fields'/'X_Phases' aihesisällön mukaan:
  // erota alkuperäinen enum-tyyppi uudelleen
}
const byVar = {};
const enumRe2 = /export enum (\w+) \{([^}]+)\}/g;
let m2;
while ((m2 = enumRe2.exec(src)) !== null) {
  const en = m2[1];
  if (en === 'WorkflowIds') continue;
  if (/^(HailerMembers|WorkspaceTeams|WorkspaceMembers|WorkspaceGroups|WorkspaceCredentialIds|GroupIds)$/.test(en)) continue;
  const kind = en.endsWith('FieldIds') ? 'Fields' : 'Phases';
  const base = en.replace(/_(FieldIds|PhaseIds)$/, '').replace(/_/g, '').toLowerCase();
  const varName = base.replace(/^./, (c) => c.toUpperCase()) + kind;
  if (!byVar[varName]) byVar[varName] = [];
  const memberRe = /(\w+)\s*=\s*"([0-9a-f]+)"/g;
  let mm;
  while ((mm = memberRe.exec(m2[2])) !== null) byVar[varName].push([mm[1], mm[2]]);
}
for (const [varName, items] of Object.entries(byVar)) {
  const seen = new Set();
  out += `export const ${varName} = {\n`;
  for (const [k, v] of items) {
    const name = strip(k);
    if (seen.has(name)) continue;
    seen.add(name);
    out += `  ${name}: '${v}',\n`;
  }
  out += '} as const;\n\n';
}
fs.mkdirSync('apps/lfc-ro-simulator/src/sim', { recursive: true });
fs.writeFileSync('apps/lfc-ro-simulator/src/sim/ids.ts', out);
const total = Object.values(byGroup).reduce((s, g) => s + g.length, 0);
console.log('ids.ts:', (out.length / 1024).toFixed(1), 'kt,', total, ' jäsentä,', Object.keys(byGroup).length, ' ryhmää');
