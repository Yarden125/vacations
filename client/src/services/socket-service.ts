import socketIOClient from "socket.io-client";

// Socket Service
class SocketService {
  private socket: any = null;

  // Initialize the socket
  public initialize() {
    // this.socket = socketIOClient("");
    this.socket = socketIOClient("http://localhost:3001");
  }

  // Disconnect the socket
  public disconnect() {
    this.socket.disconnect();
  }

  // Get the initialized socket
  public getSocket() {
    return this.socket;
  }
}

export default new SocketService();
