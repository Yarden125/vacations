import { store } from "../redux/store";

// Service for dispatching all actions to store:
class DispatchActionService{
    public dispatchAction(actionType, payloadData){
        const action = { type: actionType, payload: payloadData };
        console.log("action: ",action);
        store.dispatch(action);
    }
}

export default new DispatchActionService();