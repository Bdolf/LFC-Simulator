// Phases for workflow: ⚠️ Alerts
      
import { Alerts_PhaseIds } from "../enums";
      
export const phases: HailerPhaseUpdatePayload[] = [
  {
    _id: Alerts_PhaseIds.active_25a,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    color: "#E53E3E",
    description: "",
    fields: [],
    followers: [],
    isArchive: false,
    isEndpoint: false,
    isInitial: true,
    key: "active",
    members: [],
    name: "Active",
    possibleNextPhase: [
      Alerts_PhaseIds.acknowledged_264,
      Alerts_PhaseIds.closed_26d
    ],
    possibleNextPhaseSettings: {}
  },
  {
    _id: Alerts_PhaseIds.acknowledged_264,
    announcementFields: [],
    announcementFieldsOrder: [],
    announcementRecipients: [],
    color: "#DD6B20",
    description: "",
    fields: [],
    followers: [],
    isArchive: false,
    isEndpoint: false,
    key: "acknowledged",
    members: [],
    name: "Acknowledged",
    possibleNextPhase: [
      Alerts_PhaseIds.closed_26d
    ],
    possibleNextPhaseSettings: {}
  },
  {
    _id: Alerts_PhaseIds.closed_26d,
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