// Configuration for apps.
     
//- When creating a new app, don't set the "_id" property, it will be assigned by Hailer.
     
//- Configuration fields can be added and edited only via app's "manifest.json" file
     
//- In order to remove all the members from an app, set the "members" property to an empty array []
      
import { HailerMembers } from "./enums";
      
export const apps: HailerAppUpdatePayload[] = [
  {
    _id: "6afeb05b2df2c7403314914b",
    description: "Birds Eye",
    members: [
      {
        id: HailerMembers.workspace,
        info: {},
        permissions: []
      }
    ],
    name: "Birds Eye",
    url: "https://apps.hailer.com/6afd55f96c73bd7568e76753/6afeb05b2df2c7403314914b/"
  },
  {
    _id: "6b001bae6645d8f4a490ad03",
    description: null,
    iconGenerator: {
      gradientId: "slate-blue",
      symbolId: "chart-bar-stacked"
    },
    members: [
      {
        id: HailerMembers.petri_vnsk_3b1,
        info: {},
        permissions: []
      }
    ],
    name: "LFC RO Simulator 🚢",
    url: "https://apps.hailer.com/6afd55f96c73bd7568e76753/6b001bae6645d8f4a490ad03/"
  }
];
      