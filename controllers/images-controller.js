const express = require("express");
const vacationsLogic = require("../bll/vacations-logic");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: __dirname + "..\\..\\assets\\uploads" });
const router = express.Router();

module.exports = function(socketServer){
    // uploading image and processing the added vacation:
    router.post("/upload-image", upload.single("vacationImage"), (request, response) => {
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

    // update image and processing the updated vacation:
    router.put("/update-image", upload.single("vacationImage"),async (request, response) => {
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
    return router;
};