
import { Operating_Areas_FieldIds } from "../enums";
      
// Fields for workflow: 🗺️ Operating Areas

// Note: Field functions are extracted to ./functions/ directory
      
// They are referenced here as "@function:functionName" strings
      
export const fields: HailerFieldGeneric[] = [
  {
    _id: Operating_Areas_FieldIds.code_6aa,
    data: [],
    description: "Short area code, e.g. FROYA-NW",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "area_code",
    label: "Code",
    required: false,
    type: "text"
  },
  {
    _id: Operating_Areas_FieldIds.latitude_6ad,
    data: [],
    description: "Area centre latitude (WGS84)",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "lat",
    label: "Latitude",
    required: false,
    type: "numeric"
  },
  {
    _id: Operating_Areas_FieldIds.longitude_6b0,
    data: [],
    description: "Area centre longitude (WGS84)",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "lon",
    label: "Longitude",
    required: false,
    type: "numeric"
  },
  {
    _id: Operating_Areas_FieldIds.radius_km_6b3,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "radius_km",
    label: "Radius (km)",
    required: false,
    type: "numericunit",
    unit: "km"
  },
  {
    _id: Operating_Areas_FieldIds.salinity_6b6,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "salinity",
    label: "Salinity",
    required: false,
    type: "numericunit",
    unit: "‰"
  },
  {
    _id: Operating_Areas_FieldIds.temperature_6ba,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "temperature",
    label: "Temperature",
    required: false,
    type: "numericunit",
    unit: "°C"
  },
  {
    _id: Operating_Areas_FieldIds.turbidity_6bd,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "turbidity",
    label: "Turbidity",
    required: false,
    type: "numericunit",
    unit: "NTU"
  },
  {
    _id: Operating_Areas_FieldIds.algae_risk_6c0,
    data: [
      "Low",
      "Medium",
      "High"
    ],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "algae_risk",
    label: "Algae risk",
    required: false,
    type: "textpredefinedoptions"
  },
  {
    _id: Operating_Areas_FieldIds.pollution_6c3,
    data: [
      "Low",
      "Medium",
      "High"
    ],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "pollution",
    label: "Pollution",
    required: false,
    type: "textpredefinedoptions"
  },
  {
    _id: Operating_Areas_FieldIds.avg_depth_6c7,
    data: [],
    description: "Mean depth in the area (GEBCO)",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "avg_depth",
    label: "Avg depth",
    required: false,
    type: "numericunit",
    unit: "m"
  },
  {
    _id: Operating_Areas_FieldIds.shallow_share_6ca,
    data: [],
    description: "Share of sampled points shallower than 10 m",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "shallow_pct",
    label: "Shallow share",
    required: false,
    type: "numericunit",
    unit: "%"
  },
  {
    _id: Operating_Areas_FieldIds.nearest_farm_distance_6cd,
    data: [],
    description: "Distance to nearest active fish farm (Fiskeridir)",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "farm_distance",
    label: "Nearest farm distance",
    required: false,
    type: "numericunit",
    unit: "m"
  },
  {
    _id: Operating_Areas_FieldIds.notes_6d1,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "notes",
    label: "Notes",
    required: false,
    type: "textarea"
  },
  {
    _id: Operating_Areas_FieldIds.suitability_0100_994,
    data: [],
    description: "Computed from water-quality factors, farm proximity and shallow share",
    function: "@function:suitability_0100_994",
    functionEnabled: true,
    functionVariables: {
      algaeRisk: {
        data: [
          Operating_Areas_FieldIds.algae_risk_6c0
        ],
        type: "="
      },
      farmDistance: {
        data: [
          Operating_Areas_FieldIds.nearest_farm_distance_6cd
        ],
        type: "="
      },
      pollution: {
        data: [
          Operating_Areas_FieldIds.pollution_6c3
        ],
        type: "="
      },
      salinity: {
        data: [
          Operating_Areas_FieldIds.salinity_6b6
        ],
        type: "="
      },
      shallowPct: {
        data: [
          Operating_Areas_FieldIds.shallow_share_6ca
        ],
        type: "="
      },
      temperature: {
        data: [
          Operating_Areas_FieldIds.temperature_6ba
        ],
        type: "="
      },
      turbidity: {
        data: [
          Operating_Areas_FieldIds.turbidity_6bd
        ],
        type: "="
      }
    },
    inviteToDiscussionOnChange: false,
    key: "suitability",
    label: "Suitability (0–100)",
    required: false,
    type: "numeric"
  },
  {
    _id: Operating_Areas_FieldIds.limiting_factor_997,
    data: [],
    description: "Dominant reason when suitability is low: fish farm / shallow water / algae / turbidity / pollution",
    function: "@function:limiting_factor_997",
    functionEnabled: true,
    functionVariables: {
      algaeRisk: {
        data: [
          Operating_Areas_FieldIds.algae_risk_6c0
        ],
        type: "="
      },
      farmDistance: {
        data: [
          Operating_Areas_FieldIds.nearest_farm_distance_6cd
        ],
        type: "="
      },
      pollution: {
        data: [
          Operating_Areas_FieldIds.pollution_6c3
        ],
        type: "="
      },
      shallowPct: {
        data: [
          Operating_Areas_FieldIds.shallow_share_6ca
        ],
        type: "="
      },
      turbidity: {
        data: [
          Operating_Areas_FieldIds.turbidity_6bd
        ],
        type: "="
      }
    },
    inviteToDiscussionOnChange: false,
    key: "limiting_factor",
    label: "Limiting factor",
    required: false,
    type: "text"
  }
];
