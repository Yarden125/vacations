const express = require("express");
const usersLogic = require("../bll/users-logic");
const router = express.Router();

// router to get user's details
router.get("/userDetails/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const userDetails = await usersLogic.getUserDetailsByID(id);
        response.json(userDetails);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

// router when a new user registers:
router.post("/register", async (request, response) => {
    try {
        const user = request.body;
        const username = user.username;
        const password = user.password;
        const firstName = user.firstName;
        const lastName = user.lastName;
        const usernameExist = await usersLogic.isUsernameExists(username);
        let errorMessage = "";
        if (username.length < 4) {
            errorMessage = "Username must be at least 4 digits";
            response.status(400).json(errorMessage);
            return;
        }
        if (username === "" || null) {
            errorMessage = "Missing username";
            response.status(400).json(errorMessage);
            return;
        }
        if (password.length < 4) {
            errorMessage = "Password must be at least 4 digits";
            response.status(400).json(errorMessage);
            return;
        }
        if (password === "" || null) {
            errorMessage = "Missing password";
            response.status(400).json(errorMessage);
            return;
        }
        if (firstName === "" || null) {
            errorMessage = "Missing first name";
            response.status(400).json(errorMessage);
            return;
        }
        if (lastName === "" || null) {
            errorMessage = "Missing last name";
            response.status(400).json(errorMessage);
            return;
        }
        if (!usernameExist) {
            const addedUser = await usersLogic.addUser(user);
            await usersLogic.userLoggedInOrOut({ loggedIn: true, userId: addedUser.id });
            response.status(201).json(addedUser);
        }
        else {
            response.json(false);
        }
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

// router when user tries to log in
router.post("/login", async (request, response) => {
    try {
        const loginInfo = request.body;
        const checkedLogin = await usersLogic.checkLogin(loginInfo.username, loginInfo.password);
        if(checkedLogin){
            const userDetails = await usersLogic.getUserDetails(loginInfo.username, loginInfo.password);
            const obj = {loggedIn:true, userId: userDetails[0].id};
            await usersLogic.userLoggedInOrOut(obj);
            response.json({userDetails: userDetails[0], checkedLogin:checkedLogin});
        }
        else{
            response.json(checkedLogin); 
        }
        
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

// router to check if user is logged in
router.get("/loggedIn/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const user = await usersLogic.isUserLoggedIn(id);
        response.json(user);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

module.exports = router;