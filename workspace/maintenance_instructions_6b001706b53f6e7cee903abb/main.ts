// Configuration for workflow: 📘 Maintenance Instructions
      
import { HailerMembers, Maintenance_Instructions_FieldIds, Maintenance_Instructions_PhaseIds, WorkflowIds, WorkspaceTeams } from "../enums";
      
export const workflowConfig: HailerWorkflowUpdatePayload = {
  _id: WorkflowIds.maintenance_instructions_abb,
  allowGuests: true,
  color: "#A15445",
  coverImage: "6b00194f2643bc15daa14986",
  defaultView: "table",
  discussionPermissions: [
    "discussion.message.add",
    "discussion.message.add.attachment",
    "discussion.message.remove.own",
    "discussion.read.history"
  ],
  enableAddedField: false,
  enableAttachments: true,
  enableGuestEditing: true,
  enableLinkedAnnouncements: true,
  enableMapLocation: false,
  enableMessenger: false,
  enableModifiedField: false,
  enablePreselectedTeam: true,
  enableUniqueName: false,
  enableUnlinkedMode: true,
  fieldsOrder: [
    Maintenance_Instructions_FieldIds.action_type_698,
    Maintenance_Instructions_FieldIds.trigger_69b,
    Maintenance_Instructions_FieldIds.steps_69e,
    Maintenance_Instructions_FieldIds.duration_6a1,
    Maintenance_Instructions_FieldIds.chemicals_6a4,
    Maintenance_Instructions_FieldIds.safety_6a7
  ],
  inviteActivityCreator: true,
  key: "maintenanceInstructions",
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
  name: "📘 Maintenance Instructions",
  nameFieldPlaceHolderText: "Give a title",
  order: 2,
  phasesOrder: [
    Maintenance_Instructions_PhaseIds.new_phase_aba
  ],
  preselectedTeam: {
    account: "6afd55f96c73bd7568e7675b",
    team: WorkspaceTeams.default_team_757
  },
  translations: {
    en: {
      fields: {
        [Maintenance_Instructions_FieldIds.action_type_698]: {
          label: "Action type"
        },
        [Maintenance_Instructions_FieldIds.trigger_69b]: {
          description: "When this action is recommended",
          label: "Trigger"
        },
        [Maintenance_Instructions_FieldIds.steps_69e]: {
          description: "Step-by-step instructions (one per line)",
          label: "Steps"
        },
        [Maintenance_Instructions_FieldIds.duration_6a1]: {
          label: "Duration",
          unit: "h"
        },
        [Maintenance_Instructions_FieldIds.chemicals_6a4]: {
          label: "Chemicals"
        },
        [Maintenance_Instructions_FieldIds.safety_6a7]: {
          label: "Safety"
        }
      },
      name: "📘 Maintenance Instructions",
      nameFieldPlaceHolderText: "Give a title",
      phases: {
        [Maintenance_Instructions_PhaseIds.new_phase_aba]: {
          description: "",
          name: "New Phase",
          possibleNextPhaseSettings: {}
        }
      }
    }
  }
};
      