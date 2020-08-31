const express = require("express");
const cors = require("cors");
const vacationsController = require("./controllers/vacations-controller");
const adminController = require("./controllers/admin-controller");
const usersController = require("./controllers/users-controller");
const followedController = require("./controllers/followed-controller");

const fs = require("fs");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: __dirname + "\\assets\\uploads" });

const server = express();

const http = require("http");
const socketIO = require("socket.io");
const httpServer = http.createServer(server);
const socketServer = socketIO.listen(httpServer);

server.use(express.json());
server.use(cors());
server.use("/api/vacations", vacationsController);
server.use("/api/admin", adminController);
server.use("/api/users", usersController);
server.use("/api/followed", followedController);
server.use(express.static(__dirname));

// uploading image:
server.post("/upload-image", upload.single("vacationImage"), (request, response) => {
    const fileExtention = path.extname(request.file.originalname);
    const multerFileName = request.file.destination + "\\" + request.file.filename;
    const finalFileName = multerFileName + fileExtention;
    fs.rename(multerFileName, finalFileName, async err => {
        if (err) {
            response.status(500).json(err.message);
            return;
        }
        const addVacation = await vacationsLogic.addVacation(JSON.parse(request.body.vacation), `${request.file.filename}${fileExtention}`);
        const addedVacation = await vacationsLogic.getOneVacation(addVacation);
        socketServer.sockets.emit("vacation-has-been-added", addedVacation);
        response.status(200).json(request.file);
    });
});

// update image:
server.put("/update-image", upload.single("vacationImage"),async (request, response) => {
    if (request.file === undefined) {
        const updateVacation = await vacationsLogic.updateFullVacation(JSON.parse(request.body.vacation), `${request.body.prevImage}`);
        const updatedVacation = await vacationsLogic.getOneVacation(updateVacation);
        socketServer.sockets.emit("vacation-has-been-updated", updatedVacation);
    }
    else {
        const fileExtention = path.extname(request.file.originalname);
        const multerFileName = request.file.destination + "\\" + request.file.filename;
        const finalFileName = multerFileName + fileExtention;
        fs.rename(multerFileName, finalFileName, async err => {
            if (err) {
                response.status(500).json(err.message);
                return;
            }
            const updateVacation = await vacationsLogic.updateFullVacation(JSON.parse(request.body.vacation), `${request.file.filename}${fileExtention}`);
            const updatedVacation = await vacationsLogic.getOneVacation(updateVacation);
            socketServer.sockets.emit("vacation-has-been-updated", updatedVacation);
            response.status(200).json(request.file);
        });
        fs.unlink(`./assets/uploads/${request.body.prevImage}`, (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
});


// server.listen(3001, () => {
//     console.log("Listening to 3001...");
// });


// --------------------------Socket.io-----------------------
// const http = require("http");
// const socketIO = require("socket.io");

const vacationsLogic = require("./bll/vacations-logic");
const followedLogic = require("./bll/followed-logic");
const adminLogic = require("./bll/admin-logic");
const usersLogic = require("./bll/users-logic");

// const expressServer = express();
// const httpServer = http.createServer(expressServer);
// const socketServer = socketIO.listen(httpServer);

// // on socket connection
socketServer.sockets.on("connection", socket => {
    console.log("connection established", socket);
    // on admin-is-logged-in: log in Admin and get Admin details
    socket.on("admin-is-logged-in", async obj => {
        await adminLogic.adminLoggedInOrOut(obj);
        const admin = await adminLogic.getAdminDetails();
        socketServer.sockets.emit("admin-now-logged-in", admin);
    });

    // on user-is-logged-in: log in user and get user's username
    socket.on("user-is-logged-in", async obj => {
        await usersLogic.userLoggedInOrOut(obj);
        const user = await usersLogic.getUserUsername(obj.userId);
        socketServer.sockets.emit("user-now-logged-in", user);
    });

    // on new-user-is-logged-in: when user register log in new user and get user's username 
    socket.on("new-user-is-logged-in", async obj => {
        await usersLogic.userLoggedInOrOut(obj);
        const user = await usersLogic.getUserUsername(obj.userId);
        socketServer.sockets.emit("new-user-now-logged-in", user);
    });

    // on admin-is-logging-out: update that admin is logged out
    socket.on("admin-is-logging-out", async obj => {
        await adminLogic.adminLoggedInOrOut(obj);
    });

    // on user-is-logging-out: update that user is logged out
    socket.on("user-is-logging-out", async obj => {
        await usersLogic.userLoggedInOrOut(obj);
    });

    // on admin-delete-vacation: delete vacavtion from DB and from Server directory
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

httpServer.listen(3001, () => {
    console.log("Listening to 3001...");
});