// Configuration for workflow: ⚠️ Alerts
      
import { Alerts_FieldIds, Alerts_PhaseIds, HailerMembers, WorkflowIds, WorkspaceTeams } from "../enums";
      
export const workflowConfig: HailerWorkflowUpdatePayload = {
  _id: WorkflowIds.alerts_acd,
  allowGuests: true,
  color: "#A14597",
  coverImage: "6b0019514bf48d694dafd5a0",
  defaultView: "table",
  discussionPermissions: [
    "discussion.message.add",
    "discussion.message.add.attachment",
    "discussion.message.remove.own",
    "discussion.read.history"
  ],
  enableAddedField: true,
  enableAttachments: true,
  enableGuestEditing: true,
  enableLinkedAnnouncements: true,
  enableMapLocation: false,
  enableMessenger: true,
  enableModifiedField: true,
  enablePreselectedTeam: true,
  enableUniqueName: false,
  enableUnlinkedMode: false,
  fieldsOrder: [
    Alerts_FieldIds.alert_type_675,
    Alerts_FieldIds.severity_678,
    Alerts_FieldIds.message_67b,
    Alerts_FieldIds.area_67e,
    Alerts_FieldIds.session_681,
    Alerts_FieldIds.acknowledged_by_685
  ],
  inviteActivityCreator: true,
  key: "alerts",
  members: [
    {
      id: HailerMembers.petri_vnsk_3b1,
      info: {},
      permissions: [
        "admin"
      ]
    },
    {
      id: HailerMembers.workspace,
      info: {},
      permissions: [
        "any"
      ]
    }
  ],
  name: "⚠️ Alerts",
  nameFieldPlaceHolderText: "Give a title",
  order: 1,
  phasesOrder: [
    Alerts_PhaseIds.active_25a,
    Alerts_PhaseIds.acknowledged_264,
    Alerts_PhaseIds.closed_26d
  ],
  preselectedTeam: {
    account: "6afd55f96c73bd7568e7675b",
    team: WorkspaceTeams.default_team_757
  },
  translations: {
    en: {
      fields: {
        [Alerts_FieldIds.alert_type_675]: {
          label: "Alert type"
        },
        [Alerts_FieldIds.severity_678]: {
          label: "Severity"
        },
        [Alerts_FieldIds.message_67b]: {
          label: "Message"
        },
        [Alerts_FieldIds.area_67e]: {
          label: "Area"
        },
        [Alerts_FieldIds.session_681]: {
          label: "Session"
        },
        [Alerts_FieldIds.acknowledged_by_685]: {
          label: "Acknowledged by"
        }
      },
      name: "⚠️ Alerts",
      nameFieldPlaceHolderText: "Give a title",
      phases: {
        "6b001706b53f6e7cee903acc": {
          description: "",
          name: "New Phase",
          possibleNextPhaseSettings: {}
        },
        [Alerts_PhaseIds.active_25a]: {
          description: "",
          name: "Active",
          possibleNextPhaseSettings: {}
        },
        [Alerts_PhaseIds.acknowledged_264]: {
          description: "",
          name: "Acknowledged",
          possibleNextPhaseSettings: {}
        },
        [Alerts_PhaseIds.closed_26d]: {
          description: "",
          name: "Closed",
          possibleNextPhaseSettings: {}
        }
      }
    }
  }
};
      