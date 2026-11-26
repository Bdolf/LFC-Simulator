// Configuration for workflow: 🚫 Risk Zones
      
import { HailerMembers, Risk_Zones_FieldIds, Risk_Zones_PhaseIds, WorkflowIds, WorkspaceTeams } from "../enums";
      
export const workflowConfig: HailerWorkflowUpdatePayload = {
  _id: WorkflowIds.risk_zones_ab5,
  allowGuests: true,
  color: "#45A145",
  coverImage: "6b00194fb53f6e7cee904bd7",
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
    Risk_Zones_FieldIds.zone_type_721,
    Risk_Zones_FieldIds.label_724,
    Risk_Zones_FieldIds.latitude_727,
    Risk_Zones_FieldIds.longitude_72a,
    Risk_Zones_FieldIds.radius_72d,
    Risk_Zones_FieldIds.source_730,
    Risk_Zones_FieldIds.active_733
  ],
  inviteActivityCreator: true,
  key: "riskZones",
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
  name: "🚫 Risk Zones",
  nameFieldPlaceHolderText: "Give a title",
  order: 1,
  phasesOrder: [
    Risk_Zones_PhaseIds.new_phase_ab4
  ],
  preselectedTeam: {
    account: "6afd55f96c73bd7568e7675b",
    team: WorkspaceTeams.default_team_757
  },
  translations: {
    en: {
      fields: {
        [Risk_Zones_FieldIds.zone_type_721]: {
          label: "Zone type"
        },
        [Risk_Zones_FieldIds.label_724]: {
          label: "Label"
        },
        [Risk_Zones_FieldIds.latitude_727]: {
          label: "Latitude"
        },
        [Risk_Zones_FieldIds.longitude_72a]: {
          label: "Longitude"
        },
        [Risk_Zones_FieldIds.radius_72d]: {
          description: "Zone of influence: fish farm 500 m, shallow cell ~1.7 km grid",
          label: "Radius",
          unit: "m"
        },
        [Risk_Zones_FieldIds.source_730]: {
          description: "Fiskeridir Akvakulturregisteret / GEBCO 2020",
          label: "Source"
        },
        [Risk_Zones_FieldIds.active_733]: {
          label: "Active"
        }
      },
      name: "🚫 Risk Zones",
      nameFieldPlaceHolderText: "Give a title",
      phases: {
        [Risk_Zones_PhaseIds.new_phase_ab4]: {
          description: "",
          name: "New Phase",
          possibleNextPhaseSettings: {}
        }
      }
    }
  }
};
      