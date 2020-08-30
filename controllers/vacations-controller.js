const express = require("express");
const vacationsLogic = require("../bll/vacations-logic");

const router = express.Router();

// router to get all vacations
router.get("/", async (request,response)=>{
    try{
        const vacations = await vacationsLogic.getAllVacations();
        response.json(vacations);
    }
    catch(err){
        response.status(500).json(err.message);
    }
});

// router to get one vacation
router.get("/:id", async (request,response)=>{
    try{
        const id = +request.params.id;
        const vacation = await vacationsLogic.getOneVacation(id);
        response.json(vacation);
    }
    catch(err){
        response.status(500).json(err.message);
    }
});

module.exports = router;

