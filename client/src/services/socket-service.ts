import socketIOClient from "socket.io-client";

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
}

export default new SocketService();
