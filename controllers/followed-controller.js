const express = require("express");
const followedLogic = require("../bll/followed-logic");
const router = express.Router();

// router to get all user's followed vacations
router.get("/myVacations/:id", async (request,response)=>{
    try{
        const userId = +request.params.id;
        const followedVacations = await followedLogic.getAllFollowedVacations(userId);
        response.json(followedVacations);
    }
    catch(err){
        response.status(500).json(err.message); 
    }
});

module.exports = router;