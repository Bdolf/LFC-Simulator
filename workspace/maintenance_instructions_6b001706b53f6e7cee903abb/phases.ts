// Phases for workflow: 📘 Maintenance Instructions
      
import { Maintenance_Instructions_FieldIds, Maintenance_Instructions_PhaseIds } from "../enums";
      
export const phases: HailerPhaseUpdatePayload[] = [
  {
    _id: Maintenance_Instructions_PhaseIds.new_phase_aba,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    description: "",
    fields: [
      Maintenance_Instructions_FieldIds.action_type_698,
      Maintenance_Instructions_FieldIds.trigger_69b,
      Maintenance_Instructions_FieldIds.steps_69e,
      Maintenance_Instructions_FieldIds.duration_6a1,
      Maintenance_Instructions_FieldIds.chemicals_6a4,
      Maintenance_Instructions_FieldIds.safety_6a7
    ],
    followers: [],
    isEndpoint: false,
    key: "newPhase",
    name: "New Phase",
    possibleNextPhase: [],
    possibleNextPhaseSettings: {}
  }
];