// Actions registry - single source of truth for all workspace actions
// To create a new action, add an entry with a 'name' (no '_id') and run 'hailer-sdk ws-config actions sync'.
// To delete an action, remove its entry and run 'hailer-sdk ws-config actions sync'.
// 'folder' points to workspace/actions/<folder>/ and is auto-generated on 'hailer-sdk ws-config pull'.

export const actions: HailerActionEntry[] = [
];
