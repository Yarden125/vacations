const express = require("express");
const adminLogic = require("../bll/admin-logic");
const { request, response } = require("express");
const router = express.Router();

// router to get admin's details:
router.get("/", async (request,response)=>{
    try{
        const admin = await adminLogic.getAdminDetails();
        response.json(admin);
    }
    catch(err){
        response.status(500).json(err.message);
    }
});

// router that passes the data from admin to check if username and password are valid for the Admin
router.post("/", async (request,response)=>{
    try{
        const login = request.body;
        const checkLoginDetails = await adminLogic.isAdminExist(login);
        if(checkLoginDetails){
            await adminLogic.adminLoggedInOrOut(true);
            const admin = await adminLogic.getAdminDetails();
            response.json(admin);
        }
        else{
            response.json(checkLoginDetails);
        }
        
    }
    catch(err){
        response.status(500).json(err.message); 
    }
});

// router to check if admin is logged in
router.get("/loggedIn", async (request,response)=>{
    try{
        const admin = await adminLogic.isAdminLoggedIn();
        response.json(admin);
    }
    catch(err){
        response.status(500).json(err.message); 
    }
});

// router for logging out
// router.patch("/logout", async (request, response)=>{
//     try{
//         await adminLogic.adminLoggedInOrOut(false);
//     }
//     catch(err){
//         response.status(500).json(err.message); 
//     }
// });

module.exports = router;