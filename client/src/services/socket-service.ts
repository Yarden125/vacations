import socketIOClient from "socket.io-client";
// import { ActionType } from "../redux/actionType";
// import dispatchActionService from "./dispatchAction-service";

class SocketService {
  private isInitialized = false;
  private socket: any = null;

  public initialize() {
    this.socket = socketIOClient("http://localhost:3001");
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public getSocket() {
    //   if(!this.isInitialized){
    //      throw new Error('Socket is not connected!');
    // }
    return this.socket;
  }

  // public socketOn(msg:string, data:any, actionType:ActionType){
  //   this.socket.on(msg, data => {
  //     dispatchActionService.dispatchAction(actionType, data);
  // });
  // }
}

export default new SocketService();
