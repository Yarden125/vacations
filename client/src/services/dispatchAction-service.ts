import { store } from "../redux/store";

// Dispatching all actions to store:
class DispatchActionService{
    public dispatchAction(actionType, payloadData){
        const action = { type: actionType, payload: payloadData };
        store.dispatch(action);
    }
}

export default new DispatchActionService();