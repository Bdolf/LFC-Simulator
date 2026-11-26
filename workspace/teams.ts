// Configuration for teams
    
// Properties that can be set when updating or creating a new team: name, description, public, defaultView, members
      
import { WorkspaceMembers, WorkspaceTeams } from "./enums";
      
export const teams: HailerTeamUpdatePayload[] = [
  {
    _id: WorkspaceTeams.default_team_757,
    description: "Default Team for this Hailer.",
    members: [
      WorkspaceMembers.petri_vnsk_3b1
    ],
    name: "Default Team"
  }
];
      