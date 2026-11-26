
import { Operating_Areas_FieldIds, Production_Sessions_FieldIds, WorkflowIds } from "../enums";
      
// Fields for workflow: 💧 Production Sessions

// Note: Field functions are extracted to ./functions/ directory
      
// They are referenced here as "@function:functionName" strings
      
export const fields: HailerFieldGeneric[] = [
  {
    _id: Production_Sessions_FieldIds.area_6f3,
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
    _id: Production_Sessions_FieldIds.start_latitude_6f6,
    data: [],
    description: "Vessel position when production started (map point)",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "start_lat",
    label: "Start latitude",
    required: false,
    type: "numeric"
  },
  {
    _id: Production_Sessions_FieldIds.start_longitude_6f9,
    data: [],
    description: "Vessel position when production started (map point)",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "start_lon",
    label: "Start longitude",
    required: false,
    type: "numeric"
  },
  {
    _id: Production_Sessions_FieldIds.capacity_6fc,
    data: [],
    description: "Set production capacity 50–200 m³/h",
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "capacity_m3h",
    label: "Capacity",
    required: false,
    type: "numericunit",
    unit: "m³/h"
  },
  {
    _id: Production_Sessions_FieldIds.period_6ff,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "period",
    label: "Period",
    required: false,
    type: "datetimerange"
  },
  {
    _id: Production_Sessions_FieldIds.volume_produced_702,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "volume_m3",
    label: "Volume produced",
    required: false,
    type: "numericunit",
    unit: "m³"
  },
  {
    _id: Production_Sessions_FieldIds.feed_pressure_705,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "feed_pressure",
    label: "Feed pressure",
    required: false,
    type: "numericunit",
    unit: "bar"
  },
  {
    _id: Production_Sessions_FieldIds.membrane_p_708,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "dp_bar",
    label: "Membrane ΔP",
    required: false,
    type: "numericunit",
    unit: "bar"
  },
  {
    _id: Production_Sessions_FieldIds.permeate_conductivity_70b,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "conductivity",
    label: "Permeate conductivity",
    required: false,
    type: "numericunit",
    unit: "µS/cm"
  },
  {
    _id: Production_Sessions_FieldIds.feed_temperature_711,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "temp_c",
    label: "Feed temperature",
    required: false,
    type: "numericunit",
    unit: "°C"
  },
  {
    _id: Production_Sessions_FieldIds.notes_71e,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "notes",
    label: "Notes",
    required: false,
    type: "textarea"
  },
  {
    _id: Production_Sessions_FieldIds.fouling_risk_0100_99a,
    data: [],
    description: "Computed from area factors × produced volume",
    function: "@function:fouling_risk_0100_99a",
    functionEnabled: true,
    functionVariables: {
      algaeRisk: {
        data: [
          Production_Sessions_FieldIds.area_6f3,
          Operating_Areas_FieldIds.algae_risk_6c0
        ],
        type: ">"
      },
      capacity: {
        data: [
          Production_Sessions_FieldIds.capacity_6fc
        ],
        type: "="
      },
      farmDistance: {
        data: [
          Production_Sessions_FieldIds.area_6f3,
          Operating_Areas_FieldIds.nearest_farm_distance_6cd
        ],
        type: ">"
      },
      shallowPct: {
        data: [
          Production_Sessions_FieldIds.area_6f3,
          Operating_Areas_FieldIds.shallow_share_6ca
        ],
        type: ">"
      },
      turbidity: {
        data: [
          Production_Sessions_FieldIds.area_6f3,
          Operating_Areas_FieldIds.turbidity_6bd
        ],
        type: ">"
      },
      volume: {
        data: [
          Production_Sessions_FieldIds.volume_produced_702
        ],
        type: "="
      }
    },
    inviteToDiscussionOnChange: false,
    key: "fouling_risk",
    label: "Fouling risk (0–100)",
    required: false,
    type: "numeric"
  },
  {
    _id: Production_Sessions_FieldIds.maintenance_recommendation_99d,
    data: [],
    description: "Rule-based recommendation: CIP flush / extended freshwater flush / prefilter change / normal stop",
    function: "@function:maintenance_recommendation_99d",
    functionEnabled: true,
    functionVariables: {
      algaeRisk: {
        data: [
          Production_Sessions_FieldIds.area_6f3,
          Operating_Areas_FieldIds.algae_risk_6c0
        ],
        type: ">"
      },
      farmDistance: {
        data: [
          Production_Sessions_FieldIds.area_6f3,
          Operating_Areas_FieldIds.nearest_farm_distance_6cd
        ],
        type: ">"
      },
      shallowPct: {
        data: [
          Production_Sessions_FieldIds.area_6f3,
          Operating_Areas_FieldIds.shallow_share_6ca
        ],
        type: ">"
      },
      turbidity: {
        data: [
          Production_Sessions_FieldIds.area_6f3,
          Operating_Areas_FieldIds.turbidity_6bd
        ],
        type: ">"
      },
      volume: {
        data: [
          Production_Sessions_FieldIds.volume_produced_702
        ],
        type: "="
      }
    },
    inviteToDiscussionOnChange: false,
    key: "recommendation",
    label: "Maintenance recommendation",
    required: false,
    type: "text"
  },
  {
    _id: Production_Sessions_FieldIds.ph_measured_3f4,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "ph_measured",
    label: "pH (measured)",
    required: false,
    type: "numericunit",
    unit: "pH"
  },
  {
    _id: Production_Sessions_FieldIds.naoh_dosed_3f7,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "naoh_volume",
    label: "NaOH dosed",
    required: false,
    type: "numericunit",
    unit: "l"
  },
  {
    _id: Production_Sessions_FieldIds.antiscalant_dosed_3fa,
    data: [],
    functionEnabled: false,
    inviteToDiscussionOnChange: false,
    key: "antiscalant_volume",
    label: "Antiscalant dosed",
    required: false,
    type: "numericunit",
    unit: "l"
  }
];
