import { AppState } from "./appState";
import { AnyAction } from "redux";
import { ActionType } from "./actionType";

export function reducer(oldAppState: AppState | undefined, action: AnyAction) {
    if (!oldAppState) {
        return new AppState();
    }

    const newAppState = { ...oldAppState };

    switch (action.type) {
        // Action type - Reset the state:
        case ActionType.ResetState:
            newAppState.vacations = [];
            newAppState.user = null;
            newAppState.followedVacations = [];
            newAppState.admin = [];
            break;

        // Action type - Get All Vacations:
        case ActionType.GetAllVacations:
            newAppState.vacations = action.payload;
            break;

        // Action type - Get One Vacation:
        case ActionType.GetOneVacation:
            newAppState.vacations = action.payload;
            break;

        // Action type - Add Vacation:    
        case ActionType.AddVacation:
            let index1 = -1;
            for (let i = 0; i < newAppState.vacations.length; i++) {
                if (newAppState.vacations[i].id === action.payload.id) {
                    index1 = i;
                }
            }
            if (index1 === -1) {
                newAppState.vacations.unshift(action.payload);
            }
            break;

        // Action type - Delete one Vacation with id:
        case ActionType.DeleteVacation:
            let index2 = -1;
            for (let i = 0; i < newAppState.vacations.length; i++) {
                if (newAppState.vacations[i].id === action.payload) {
                    index2 = i;
                }
            }
            if (index2 !== -1) {
                newAppState.vacations.splice(index2, 1);
            }
            break;

        // Action type - Update Vacation:
        case ActionType.UpdateFullVacation:
            for (let i = 0; i < newAppState.vacations.length; i++) {
                if (newAppState.vacations[i].id === action.payload.id) {
                    newAppState.vacations[i] = action.payload;
                }
            }
            break;

        // Action type - Follow Vacation:
        case ActionType.AddFollowedVacation:
            newAppState.followedVacations.unshift(action.payload);
            break;

        // Action type - Get All Followed Vacations:
        case ActionType.GetAllFollowedVacations:
            newAppState.followedVacations = action.payload;
            break;

        // Action type - Unfollow Vacation:
        case ActionType.UnfollowVacation:
            let index3 = -1;
            for (let i = 0; i < newAppState.followedVacations.length; i++) {
                if (newAppState.followedVacations[i].userID === action.payload.userID && newAppState.followedVacations[i].vacationID === action.payload.vacationID) {
                    index3 = i;
                }
            }
            if (index3 !== -1) {
                newAppState.followedVacations.splice(index3, 1);
            }
            break;

        // Action type - Get One User:
        case ActionType.GetOneUser:
            newAppState.user = action.payload;
            break;

        // Action type - Get Admin:
        case ActionType.GetAdmin:
            newAppState.admin = action.payload;
            break;

    }
    return newAppState;
}
