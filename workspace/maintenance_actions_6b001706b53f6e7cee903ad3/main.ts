// Configuration for workflow: 🔧 Maintenance Actions
      
import { HailerMembers, Maintenance_Actions_FieldIds, Maintenance_Actions_PhaseIds, WorkflowIds, WorkspaceTeams } from "../enums";
      
export const workflowConfig: HailerWorkflowUpdatePayload = {
  _id: WorkflowIds.maintenance_actions_ad3,
  allowGuests: true,
  color: "#49A145",
  coverImage: "6b001951a41a35a729eba2e3",
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
    Maintenance_Actions_FieldIds.action_type_688,
    Maintenance_Actions_FieldIds.instruction_68b,
    Maintenance_Actions_FieldIds.session_68e,
    Maintenance_Actions_FieldIds.performed_by_691,
    Maintenance_Actions_FieldIds.notes_694
  ],
  inviteActivityCreator: true,
  key: "maintenanceActions",
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
  name: "🔧 Maintenance Actions",
  nameFieldPlaceHolderText: "Give a title",
  order: 2,
  phasesOrder: [
    Maintenance_Actions_PhaseIds.open_27a,
    Maintenance_Actions_PhaseIds.done_283,
    Maintenance_Actions_PhaseIds.closed_28c
  ],
  preselectedTeam: {
    account: "6afd55f96c73bd7568e7675b",
    team: WorkspaceTeams.default_team_757
  },
  translations: {
    en: {
      fields: {
        [Maintenance_Actions_FieldIds.action_type_688]: {
          label: "Action type"
        },
        [Maintenance_Actions_FieldIds.instruction_68b]: {
          label: "Instruction"
        },
        [Maintenance_Actions_FieldIds.session_68e]: {
          label: "Session"
        },
        [Maintenance_Actions_FieldIds.performed_by_691]: {
          label: "Performed by"
        },
        [Maintenance_Actions_FieldIds.notes_694]: {
          label: "Notes"
        }
      },
      name: "🔧 Maintenance Actions",
      nameFieldPlaceHolderText: "Give a title",
      phases: {
        "6b001706b53f6e7cee903ad2": {
          description: "",
          name: "New Phase",
          possibleNextPhaseSettings: {}
        },
        [Maintenance_Actions_PhaseIds.open_27a]: {
          description: "",
          name: "Open",
          possibleNextPhaseSettings: {}
        },
        [Maintenance_Actions_PhaseIds.done_283]: {
          description: "",
          name: "Done",
          possibleNextPhaseSettings: {}
        },
        [Maintenance_Actions_PhaseIds.closed_28c]: {
          description: "",
          name: "Closed",
          possibleNextPhaseSettings: {}
        }
      }
    }
  }
};
      