// Phases for workflow: 🗺️ Operating Areas
      
import { Operating_Areas_FieldIds, Operating_Areas_PhaseIds } from "../enums";
      
export const phases: HailerPhaseUpdatePayload[] = [
  {
    _id: Operating_Areas_PhaseIds.new_phase_aae,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    description: "",
    fields: [
      Operating_Areas_FieldIds.code_6aa,
      Operating_Areas_FieldIds.latitude_6ad,
      Operating_Areas_FieldIds.longitude_6b0,
      Operating_Areas_FieldIds.radius_km_6b3,
      Operating_Areas_FieldIds.salinity_6b6,
      Operating_Areas_FieldIds.temperature_6ba,
      Operating_Areas_FieldIds.turbidity_6bd,
      Operating_Areas_FieldIds.algae_risk_6c0,
      Operating_Areas_FieldIds.pollution_6c3,
      Operating_Areas_FieldIds.avg_depth_6c7,
      Operating_Areas_FieldIds.shallow_share_6ca,
      Operating_Areas_FieldIds.nearest_farm_distance_6cd,
      Operating_Areas_FieldIds.notes_6d1,
      Operating_Areas_FieldIds.suitability_0100_994,
      Operating_Areas_FieldIds.limiting_factor_997
    ],
    followers: [],
    isEndpoint: false,
    key: "newPhase",
    name: "New Phase",
    possibleNextPhase: [],
    possibleNextPhaseSettings: {}
  }
];