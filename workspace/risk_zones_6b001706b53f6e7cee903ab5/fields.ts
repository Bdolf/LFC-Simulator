
import { Risk_Zones_FieldIds } from "../enums";
      
// Fields for workflow: 🚫 Risk Zones

// Note: Field functions are extracted to ./functions/ directory
      
// They are referenced here as "@function:functionName" strings
      
export const fields: HailerFieldGeneric[] = [
  {
    _id: Risk_Zones_FieldIds.zone_type_721,
    data: [
      "Fish farm",
      "Shallow water"
    ],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "zone_type",
    label: "Zone type",
    required: false,
    type: "textpredefinedoptions"
  },
  {
    _id: Risk_Zones_FieldIds.label_724,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "zone_label",
    label: "Label",
    required: false,
    type: "text"
  },
  {
    _id: Risk_Zones_FieldIds.latitude_727,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "lat",
    label: "Latitude",
    required: false,
    type: "numeric"
  },
  {
    _id: Risk_Zones_FieldIds.longitude_72a,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "lon",
    label: "Longitude",
    required: false,
    type: "numeric"
  },
  {
    _id: Risk_Zones_FieldIds.radius_72d,
    data: [],
    description: "Zone of influence: fish farm 500 m, shallow cell ~1.7 km grid",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "radius_m",
    label: "Radius",
    required: false,
    type: "numericunit",
    unit: "m"
  },
  {
    _id: Risk_Zones_FieldIds.source_730,
    data: [],
    description: "Fiskeridir Akvakulturregisteret / GEBCO 2020",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "source",
    label: "Source",
    required: false,
    type: "text"
  },
  {
    _id: Risk_Zones_FieldIds.active_733,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "active",
    label: "Active",
    modifier: {
      checkbox: true
    },
    required: false,
    type: "numeric"
  }
];
