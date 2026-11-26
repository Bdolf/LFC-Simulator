// Phases for workflow: 🔧 Maintenance Actions
      
import { Maintenance_Actions_PhaseIds } from "../enums";
      
export const phases: HailerPhaseUpdatePayload[] = [
  {
    _id: Maintenance_Actions_PhaseIds.open_27a,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    color: "#3182CE",
    description: "",
    fields: [],
    followers: [],
    isArchive: false,
    isEndpoint: false,
    isInitial: true,
    key: "open",
    members: [],
    name: "Open",
    possibleNextPhase: [
      Maintenance_Actions_PhaseIds.done_283
    ],
    possibleNextPhaseSettings: {}
  },
  {
    _id: Maintenance_Actions_PhaseIds.done_283,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    color: "#38A169",
    description: "",
    fields: [],
    followers: [],
    isArchive: false,
    isEndpoint: false,
    key: "done",
    members: [],
    name: "Done",
    possibleNextPhase: [
      Maintenance_Actions_PhaseIds.closed_28c
    ],
    possibleNextPhaseSettings: {}
  },
  {
    _id: Maintenance_Actions_PhaseIds.closed_28c,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    color: "#A0AEC0",
    description: "",
    fields: [],
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