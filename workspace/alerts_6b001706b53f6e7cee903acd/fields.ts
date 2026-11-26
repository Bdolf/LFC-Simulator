
import { Alerts_FieldIds, WorkflowIds } from "../enums";
      
// Fields for workflow: ⚠️ Alerts

// Note: Field functions are extracted to ./functions/ directory
      
// They are referenced here as "@function:functionName" strings
      
export const fields: HailerFieldGeneric[] = [
  {
    _id: Alerts_FieldIds.alert_type_675,
    data: [
      "Fish farm proximity",
      "Shallow water",
      "Fouling risk",
      "Measurement alarm",
      "Other"
    ],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "alert_type",
    label: "Alert type",
    required: false,
    type: "textpredefinedoptions"
  },
  {
    _id: Alerts_FieldIds.severity_678,
    data: [
      "Warning",
      "Critical"
    ],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "severity",
    label: "Severity",
    required: false,
    type: "textpredefinedoptions"
  },
  {
    _id: Alerts_FieldIds.message_67b,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "message",
    label: "Message",
    required: false,
    type: "textarea"
  },
  {
    _id: Alerts_FieldIds.area_67e,
    data: [
      WorkflowIds.operating_areas_aaf
    ],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "area",
    label: "Area",
    required: false,
    type: "activitylink"
  },
  {
    _id: Alerts_FieldIds.session_681,
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
    _id: Alerts_FieldIds.acknowledged_by_685,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "acknowledged_by",
    label: "Acknowledged by",
    required: false,
    type: "users"
  }
];
