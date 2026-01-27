import type { OperationalHubProfileConfigurationOperations } from "@powerhousedao/contributor-billing/document-models/operational-hub-profile";

export const operationalHubProfileConfigurationOperations: OperationalHubProfileConfigurationOperations =
  {
    setOperationalHubNameOperation(state, action) {
      state.name = action.input.name;
    },
    setOperatorTeamOperation(state, action) {
      state.operatorTeam = action.input.operatorTeam || null;
    },
    addSubteamOperation(state, action) {
      if (!state.subteams.includes(action.input.subteam)) {
        state.subteams.push(action.input.subteam);
      }
    },
    removeSubteamOperation(state, action) {
      const index = state.subteams.indexOf(action.input.subteam);
      if (index !== -1) {
        state.subteams.splice(index, 1);
      }
    },
  };
