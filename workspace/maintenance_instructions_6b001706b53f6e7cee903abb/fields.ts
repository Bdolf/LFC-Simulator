
import { Maintenance_Instructions_FieldIds } from "../enums";
      
// Fields for workflow: 📘 Maintenance Instructions

// Note: Field functions are extracted to ./functions/ directory
      
// They are referenced here as "@function:functionName" strings
      
export const fields: HailerFieldGeneric[] = [
  {
    _id: Maintenance_Instructions_FieldIds.action_type_698,
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
    _id: Maintenance_Instructions_FieldIds.trigger_69b,
    data: [],
    description: "When this action is recommended",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "trigger",
    label: "Trigger",
    required: false,
    type: "text"
  },
  {
    _id: Maintenance_Instructions_FieldIds.steps_69e,
    data: [],
    description: "Step-by-step instructions (one per line)",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "steps",
    label: "Steps",
    required: false,
    type: "textarea"
  },
  {
    _id: Maintenance_Instructions_FieldIds.duration_6a1,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "duration_h",
    label: "Duration",
    required: false,
    type: "numericunit",
    unit: "h"
  },
  {
    _id: Maintenance_Instructions_FieldIds.chemicals_6a4,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "chemicals",
    label: "Chemicals",
    required: false,
    type: "text"
  },
  {
    _id: Maintenance_Instructions_FieldIds.safety_6a7,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "safety",
    label: "Safety",
    required: false,
    type: "textarea"
  }
];
