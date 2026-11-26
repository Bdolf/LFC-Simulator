// Phases for workflow: 💧 Production Sessions
      
import { Production_Sessions_FieldIds, Production_Sessions_PhaseIds } from "../enums";
      
export const phases: HailerPhaseUpdatePayload[] = [
  {
    _id: Production_Sessions_PhaseIds.planned_299,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    color: "#57636E",
    description: "",
    fields: [
      Production_Sessions_FieldIds.fouling_risk_0100_99a,
      Production_Sessions_FieldIds.maintenance_recommendation_99d,
      Production_Sessions_FieldIds.ph_measured_3f4,
      Production_Sessions_FieldIds.naoh_dosed_3f7,
      Production_Sessions_FieldIds.antiscalant_dosed_3fa
    ],
    followers: [],
    isArchive: false,
    isEndpoint: false,
    isInitial: true,
    key: "planned",
    members: [],
    name: "Planned",
    possibleNextPhase: [
      Production_Sessions_PhaseIds.active_2a2
    ],
    possibleNextPhaseSettings: {}
  },
  {
    _id: Production_Sessions_PhaseIds.active_2a2,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    color: "#38A169",
    description: "",
    fields: [
      Production_Sessions_FieldIds.fouling_risk_0100_99a,
      Production_Sessions_FieldIds.maintenance_recommendation_99d,
      Production_Sessions_FieldIds.ph_measured_3f4,
      Production_Sessions_FieldIds.naoh_dosed_3f7,
      Production_Sessions_FieldIds.antiscalant_dosed_3fa
    ],
    followers: [],
    isArchive: false,
    isEndpoint: false,
    key: "active",
    members: [],
    name: "Active",
    possibleNextPhase: [
      Production_Sessions_PhaseIds.ended_2ab
    ],
    possibleNextPhaseSettings: {}
  },
  {
    _id: Production_Sessions_PhaseIds.ended_2ab,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    color: "#3182CE",
    description: "",
    fields: [
      Production_Sessions_FieldIds.fouling_risk_0100_99a,
      Production_Sessions_FieldIds.maintenance_recommendation_99d,
      Production_Sessions_FieldIds.ph_measured_3f4,
      Production_Sessions_FieldIds.naoh_dosed_3f7,
      Production_Sessions_FieldIds.antiscalant_dosed_3fa
    ],
    followers: [],
    isArchive: false,
    isEndpoint: false,
    key: "ended",
    members: [],
    name: "Ended",
    possibleNextPhase: [
      Production_Sessions_PhaseIds.maintenance_2b4,
      Production_Sessions_PhaseIds.closed_2be
    ],
    possibleNextPhaseSettings: {}
  },
  {
    _id: Production_Sessions_PhaseIds.maintenance_2b4,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    color: "#DD6B20",
    description: "",
    fields: [
      Production_Sessions_FieldIds.fouling_risk_0100_99a,
      Production_Sessions_FieldIds.maintenance_recommendation_99d,
      Production_Sessions_FieldIds.ph_measured_3f4,
      Production_Sessions_FieldIds.naoh_dosed_3f7,
      Production_Sessions_FieldIds.antiscalant_dosed_3fa
    ],
    followers: [],
    isArchive: false,
    isEndpoint: false,
    key: "maintenance",
    members: [],
    name: "Maintenance",
    possibleNextPhase: [
      Production_Sessions_PhaseIds.closed_2be
    ],
    possibleNextPhaseSettings: {}
  },
  {
    _id: Production_Sessions_PhaseIds.closed_2be,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    color: "#A0AEC0",
    description: "",
    fields: [
      Production_Sessions_FieldIds.fouling_risk_0100_99a,
      Production_Sessions_FieldIds.maintenance_recommendation_99d,
      Production_Sessions_FieldIds.ph_measured_3f4,
      Production_Sessions_FieldIds.naoh_dosed_3f7,
      Production_Sessions_FieldIds.antiscalant_dosed_3fa
    ],
    followers: [],
    isArchive: false,
    isEndpoint: true,
    key: "closed",
    members: [],
    name: "Closed",
    possibleNextPhase: [],
    possibleNextPhaseSettings: {}
  }
];