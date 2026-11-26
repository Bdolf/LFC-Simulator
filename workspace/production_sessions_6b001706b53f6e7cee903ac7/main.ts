// Configuration for workflow: 💧 Production Sessions
      
import { HailerMembers, Production_Sessions_FieldIds, Production_Sessions_PhaseIds, WorkflowIds, WorkspaceTeams } from "../enums";
      
export const workflowConfig: HailerWorkflowUpdatePayload = {
  _id: WorkflowIds.production_sessions_ac7,
  allowGuests: true,
  color: "#65A145",
  coverImage: "6b001950156ea9e4043485cc",
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
    Production_Sessions_FieldIds.area_6f3,
    Production_Sessions_FieldIds.start_latitude_6f6,
    Production_Sessions_FieldIds.start_longitude_6f9,
    Production_Sessions_FieldIds.capacity_6fc,
    Production_Sessions_FieldIds.period_6ff,
    Production_Sessions_FieldIds.volume_produced_702,
    Production_Sessions_FieldIds.feed_pressure_705,
    Production_Sessions_FieldIds.membrane_p_708,
    Production_Sessions_FieldIds.permeate_conductivity_70b,
    Production_Sessions_FieldIds.feed_temperature_711,
    Production_Sessions_FieldIds.notes_71e,
    Production_Sessions_FieldIds.fouling_risk_0100_99a,
    Production_Sessions_FieldIds.maintenance_recommendation_99d,
    Production_Sessions_FieldIds.ph_measured_3f4,
    Production_Sessions_FieldIds.naoh_dosed_3f7,
    Production_Sessions_FieldIds.antiscalant_dosed_3fa
  ],
  inviteActivityCreator: true,
  key: "productionSessions",
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
  name: "💧 Production Sessions",
  nameFieldPlaceHolderText: "Give a title",
  order: 0,
  phasesOrder: [
    Production_Sessions_PhaseIds.planned_299,
    Production_Sessions_PhaseIds.active_2a2,
    Production_Sessions_PhaseIds.ended_2ab,
    Production_Sessions_PhaseIds.maintenance_2b4,
    Production_Sessions_PhaseIds.closed_2be
  ],
  preselectedTeam: {
    account: "6afd55f96c73bd7568e7675b",
    team: WorkspaceTeams.default_team_757
  },
  translations: {
    en: {
      fields: {
        [Production_Sessions_FieldIds.area_6f3]: {
          label: "Area"
        },
        [Production_Sessions_FieldIds.start_latitude_6f6]: {
          description: "Vessel position when production started (map point)",
          label: "Start latitude"
        },
        [Production_Sessions_FieldIds.start_longitude_6f9]: {
          description: "Vessel position when production started (map point)",
          label: "Start longitude"
        },
        [Production_Sessions_FieldIds.capacity_6fc]: {
          description: "Set production capacity 50–200 m³/h",
          label: "Capacity",
          unit: "m³/h"
        },
        [Production_Sessions_FieldIds.period_6ff]: {
          label: "Period"
        },
        [Production_Sessions_FieldIds.volume_produced_702]: {
          label: "Volume produced",
          unit: "m³"
        },
        [Production_Sessions_FieldIds.feed_pressure_705]: {
          label: "Feed pressure",
          unit: "bar"
        },
        [Production_Sessions_FieldIds.membrane_p_708]: {
          label: "Membrane ΔP",
          unit: "bar"
        },
        [Production_Sessions_FieldIds.permeate_conductivity_70b]: {
          label: "Permeate conductivity",
          unit: "µS/cm"
        },
        [Production_Sessions_FieldIds.feed_temperature_711]: {
          label: "Feed temperature",
          unit: "°C"
        },
        [Production_Sessions_FieldIds.notes_71e]: {
          label: "Notes"
        },
        [Production_Sessions_FieldIds.fouling_risk_0100_99a]: {
          description: "Computed from area factors × produced volume",
          label: "Fouling risk (0–100)"
        },
        [Production_Sessions_FieldIds.maintenance_recommendation_99d]: {
          description: "Rule-based recommendation: CIP flush / extended freshwater flush / prefilter change / normal stop",
          label: "Maintenance recommendation"
        },
        [Production_Sessions_FieldIds.ph_measured_3f4]: {
          label: "pH (measured)",
          unit: "pH"
        },
        [Production_Sessions_FieldIds.naoh_dosed_3f7]: {
          label: "NaOH dosed",
          unit: "l"
        },
        [Production_Sessions_FieldIds.antiscalant_dosed_3fa]: {
          label: "Antiscalant dosed",
          unit: "l"
        }
      },
      name: "💧 Production Sessions",
      nameFieldPlaceHolderText: "Give a title",
      phases: {
        "6b001706b53f6e7cee903ac6": {
          description: "",
          name: "New Phase",
          possibleNextPhaseSettings: {}
        },
        [Production_Sessions_PhaseIds.planned_299]: {
          description: "",
          name: "Planned",
          possibleNextPhaseSettings: {}
        },
        [Production_Sessions_PhaseIds.active_2a2]: {
          description: "",
          name: "Active",
          possibleNextPhaseSettings: {}
        },
        [Production_Sessions_PhaseIds.ended_2ab]: {
          description: "",
          name: "Ended",
          possibleNextPhaseSettings: {}
        },
        [Production_Sessions_PhaseIds.maintenance_2b4]: {
          description: "",
          name: "Maintenance",
          possibleNextPhaseSettings: {}
        },
        [Production_Sessions_PhaseIds.closed_2be]: {
          description: "",
          name: "Closed",
          possibleNextPhaseSettings: {}
        }
      }
    }
  }
};
      