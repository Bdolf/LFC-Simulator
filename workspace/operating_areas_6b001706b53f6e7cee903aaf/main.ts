// Configuration for workflow: 🗺️ Operating Areas
      
import { HailerMembers, Operating_Areas_FieldIds, Operating_Areas_PhaseIds, WorkflowIds, WorkspaceTeams } from "../enums";
      
export const workflowConfig: HailerWorkflowUpdatePayload = {
  _id: WorkflowIds.operating_areas_aaf,
  allowGuests: true,
  color: "#45A159",
  coverImage: "6b00194e4bf48d694dafd584",
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
  inviteActivityCreator: true,
  key: "operatingAreas",
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
  name: "🗺️ Operating Areas",
  nameFieldPlaceHolderText: "Give a title",
  order: 0,
  phasesOrder: [
    Operating_Areas_PhaseIds.new_phase_aae
  ],
  preselectedTeam: {
    account: "6afd55f96c73bd7568e7675b",
    team: WorkspaceTeams.default_team_757
  },
  translations: {
    en: {
      fields: {
        [Operating_Areas_FieldIds.code_6aa]: {
          description: "Short area code, e.g. FROYA-NW",
          label: "Code"
        },
        [Operating_Areas_FieldIds.latitude_6ad]: {
          description: "Area centre latitude (WGS84)",
          label: "Latitude"
        },
        [Operating_Areas_FieldIds.longitude_6b0]: {
          description: "Area centre longitude (WGS84)",
          label: "Longitude"
        },
        [Operating_Areas_FieldIds.radius_km_6b3]: {
          label: "Radius (km)",
          unit: "km"
        },
        [Operating_Areas_FieldIds.salinity_6b6]: {
          label: "Salinity",
          unit: "‰"
        },
        [Operating_Areas_FieldIds.temperature_6ba]: {
          label: "Temperature",
          unit: "°C"
        },
        [Operating_Areas_FieldIds.turbidity_6bd]: {
          label: "Turbidity",
          unit: "NTU"
        },
        [Operating_Areas_FieldIds.algae_risk_6c0]: {
          label: "Algae risk"
        },
        [Operating_Areas_FieldIds.pollution_6c3]: {
          label: "Pollution"
        },
        [Operating_Areas_FieldIds.avg_depth_6c7]: {
          description: "Mean depth in the area (GEBCO)",
          label: "Avg depth",
          unit: "m"
        },
        [Operating_Areas_FieldIds.shallow_share_6ca]: {
          description: "Share of sampled points shallower than 10 m",
          label: "Shallow share",
          unit: "%"
        },
        [Operating_Areas_FieldIds.nearest_farm_distance_6cd]: {
          description: "Distance to nearest active fish farm (Fiskeridir)",
          label: "Nearest farm distance",
          unit: "m"
        },
        [Operating_Areas_FieldIds.notes_6d1]: {
          label: "Notes"
        },
        [Operating_Areas_FieldIds.suitability_0100_994]: {
          description: "Computed from water-quality factors, farm proximity and shallow share",
          label: "Suitability (0–100)"
        },
        [Operating_Areas_FieldIds.limiting_factor_997]: {
          description: "Dominant reason when suitability is low: fish farm / shallow water / algae / turbidity / pollution",
          label: "Limiting factor"
        }
      },
      name: "🗺️ Operating Areas",
      nameFieldPlaceHolderText: "Give a title",
      phases: {
        [Operating_Areas_PhaseIds.new_phase_aae]: {
          description: "",
          name: "New Phase",
          possibleNextPhaseSettings: {}
        }
      }
    }
  }
};
      