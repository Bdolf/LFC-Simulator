// Workflows registry - single source of truth for all workflows
// When creating a new workflow, only 'name' and 'enabledUnlinkedMode' can be set
// 'folder' property indicates the folder where the workflow configuration is stored and it's auto-generated on 'hailer-sdk ws-config pull'

export const workflows: WorkflowEntry[] = [
  {
    _id: "6b001706b53f6e7cee903aaf",
    name: "🗺️ Operating Areas",
    enableUnlinkedMode: true,
    folder: "operating_areas_6b001706b53f6e7cee903aaf",
  },
  {
    _id: "6b001706b53f6e7cee903ab5",
    name: "🚫 Risk Zones",
    enableUnlinkedMode: true,
    folder: "risk_zones_6b001706b53f6e7cee903ab5",
  },
  {
    _id: "6b001706b53f6e7cee903abb",
    name: "📘 Maintenance Instructions",
    enableUnlinkedMode: true,
    folder: "maintenance_instructions_6b001706b53f6e7cee903abb",
  },
  {
    _id: "6b001706b53f6e7cee903ac1",
    name: "📟 PLC Tag Map",
    enableUnlinkedMode: true,
    folder: "plc_tag_map_6b001706b53f6e7cee903ac1",
  },
  {
    _id: "6b001706b53f6e7cee903ac7",
    name: "💧 Production Sessions",
    enableUnlinkedMode: false,
    folder: "production_sessions_6b001706b53f6e7cee903ac7",
  },
  {
    _id: "6b001706b53f6e7cee903acd",
    name: "⚠️ Alerts",
    enableUnlinkedMode: false,
    folder: "alerts_6b001706b53f6e7cee903acd",
  },
  {
    _id: "6b001706b53f6e7cee903ad3",
    name: "🔧 Maintenance Actions",
    enableUnlinkedMode: false,
    folder: "maintenance_actions_6b001706b53f6e7cee903ad3",
  }
];
