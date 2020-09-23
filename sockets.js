const fs = require("fs");
const vacationsLogic = require("./bll/vacations-logic");
const followedLogic = require("./bll/followed-logic");
const adminLogic = require("./bll/admin-logic");
const usersLogic = require("./bll/users-logic");

module.exports = function(socketServer){
    socketServer.sockets.on("connection", socket => {
        
        // on admin-is-logging-out: update that admin is logged out
        socket.on("admin-is-logging-out", async obj => {
            await adminLogic.adminLoggedInOrOut(obj);
        });

        // on user-is-logging-out: update that user is logged out
        socket.on("user-is-logging-out", async obj => {
            await usersLogic.userLoggedInOrOut(obj);
        });

        // on admin-delete-vacation: delete vacavtion from DB and from Server's 'assets/uploads' directory
        socket.on("admin-delete-vacation", async obj => {
            await vacationsLogic.deleteVacation(obj.id);
            fs.unlink(`./assets/uploads/${obj.image}`, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            socketServer.sockets.emit("vacation-was-deleted", obj.id);
        });

        // on user-follow-vacation:
        socket.on("user-follow-vacation", async followObj => {
            await followedLogic.addFollowedVacation(followObj);
            socketServer.sockets.emit("vacation-is-being-followed", followObj);
        });

        // on user-unfollow-vacation:
        socket.on("user-unfollow-vacation", async unfollowObj => {
            await followedLogic.unfollowVacation(unfollowObj);
            socketServer.sockets.emit("vacation-is-being-unfollowed", unfollowObj);
        });
    });
};