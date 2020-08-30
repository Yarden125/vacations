// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const socketIO = require("socket.io");

// const vacationsLogic = require("./bll/vacations-logic");
// const followedLogic = require("./bll/followed-logic");
// const adminLogic = require("./bll/admin-logic");
// const usersLogic = require("./bll/users-logic");

// const expressServer = express();
// expressServer.use(express.json());
// expressServer.use(cors());
// expressServer.use(express.static(__dirname));
// const httpServer = http.createServer(expressServer);
// const socketServer = socketIO.listen(httpServer);

// // on socket connection
// socketServer.sockets.on("connection", socket => {

//     // on admin-is-logged-in: log in Admin and get Admin details
//     socket.on("admin-is-logged-in", async obj => {
//         await adminLogic.adminLoggedInOrOut(obj);
//         const admin = await adminLogic.getAdminDetails();
//         socketServer.sockets.emit("admin-now-logged-in", admin);
//     });

//     // on user-is-logged-in: log in user and get user's username
//     socket.on("user-is-logged-in", async obj => {
//         await usersLogic.userLoggedInOrOut(obj);
//         const user = await usersLogic.getUserUsername(obj.userId);
//         socketServer.sockets.emit("user-now-logged-in", user);
//     });

//     // on new-user-is-logged-in: when user register log in new user and get user's username 
//     socket.on("new-user-is-logged-in", async obj => {
//         await usersLogic.userLoggedInOrOut(obj);
//         const user = await usersLogic.getUserUsername(obj.userId);
//         socketServer.sockets.emit("new-user-now-logged-in", user);
//     });

//     // on admin-is-logging-out: update that admin is logged out
//     socket.on("admin-is-logging-out", async obj => {
//         await adminLogic.adminLoggedInOrOut(obj);
//     });

//     // on user-is-logging-out: update that user is logged out
//     socket.on("user-is-logging-out", async obj => {
//         await usersLogic.userLoggedInOrOut(obj);
//     });

//     // on admin-delete-vacation: delete vacavtion from DB and from Server directory
//     socket.on("admin-delete-vacation", async obj => {
//         await vacationsLogic.deleteVacation(obj.id);
//         fs.unlink(`./assets/uploads/${obj.image}`, (err) => {
//             if (err) {
//                 console.log(err);
//                 return;
//             }
//         });
//         socketServer.sockets.emit("vacation-was-deleted", obj.id);
//     });

//     // on user-follow-vacation:
//     socket.on("user-follow-vacation", async followObj => {
//         await followedLogic.addFollowedVacation(followObj);
//         socketServer.sockets.emit("vacation-is-being-followed", followObj);
//     });

//     // on user-unfollow-vacation:
//     socket.on("user-unfollow-vacation", async unfollowObj => {
//         await followedLogic.unfollowVacation(unfollowObj);
//         socketServer.sockets.emit("vacation-is-being-unfollowed", unfollowObj);
//     });
// });

// httpServer.listen(3002, () => console.log("Socket- Listening on 3002..."));