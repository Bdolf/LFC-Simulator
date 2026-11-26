
import { Maintenance_Actions_FieldIds, WorkflowIds } from "../enums";
      
// Fields for workflow: 🔧 Maintenance Actions

// Note: Field functions are extracted to ./functions/ directory
      
// They are referenced here as "@function:functionName" strings
      
export const fields: HailerFieldGeneric[] = [
  {
    _id: Maintenance_Actions_FieldIds.action_type_688,
    data: [
      "CIP flush",
      "Extended freshwater flush",
      "Prefilter change",
      "Membrane inspection",
      "Normal stop"
    ],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "action_type",
    label: "Action type",
    required: false,
    type: "textpredefinedoptions"
  },
  {
    _id: Maintenance_Actions_FieldIds.instruction_68b,
    data: [
      WorkflowIds.maintenance_instructions_abb
    ],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "instruction",
    label: "Instruction",
    required: false,
    type: "activitylink"
  },
  {
    _id: Maintenance_Actions_FieldIds.session_68e,
    data: [
      WorkflowIds.production_sessions_ac7
    ],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "session",
    label: "Session",
    required: false,
    type: "activitylink"
  },
  {
    _id: Maintenance_Actions_FieldIds.performed_by_691,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "performed_by",
    label: "Performed by",
    required: false,
    type: "users"
  },
  {
    _id: Maintenance_Actions_FieldIds.notes_694,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "notes",
    label: "Notes",
    required: false,
    type: "textarea"
  }
];
