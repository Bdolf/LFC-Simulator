// Phases for workflow: 🚫 Risk Zones
      
import { Risk_Zones_FieldIds, Risk_Zones_PhaseIds } from "../enums";
      
export const phases: HailerPhaseUpdatePayload[] = [
  {
    _id: Risk_Zones_PhaseIds.new_phase_ab4,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    description: "",
    fields: [
      Risk_Zones_FieldIds.zone_type_721,
      Risk_Zones_FieldIds.label_724,
      Risk_Zones_FieldIds.latitude_727,
      Risk_Zones_FieldIds.longitude_72a,
      Risk_Zones_FieldIds.radius_72d,
      Risk_Zones_FieldIds.source_730,
      Risk_Zones_FieldIds.active_733
    ],
    followers: [],
    isEndpoint: false,
    key: "newPhase",
    name: "New Phase",
    possibleNextPhase: [],
    possibleNextPhaseSettings: {}
  }
];