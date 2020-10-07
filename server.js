const express = require("express");
const cors = require("cors");
const server = express();
const http = require("http");
const socketIO = require("socket.io");
const httpServer = http.createServer(server);
const socketServer = socketIO.listen(httpServer);
const sockets = require("./sockets")(socketServer);
const imagesController = require("./controllers/images-controller")(socketServer);
const vacationsController = require("./controllers/vacations-controller");
const adminController = require("./controllers/admin-controller");
const usersController = require("./controllers/users-controller");
const followedController = require("./controllers/followed-controller");

server.use(express.json());
server.use(cors());
server.use("/api/vacations", vacationsController);
server.use("/api/admin", adminController);
server.use("/api/users", usersController);
server.use("/api/followed", followedController);
server.use("/api/images", imagesController);
server.use(express.static(__dirname));

httpServer.listen(3002, () => {
    console.log(`Listening to port 3002...`);
});