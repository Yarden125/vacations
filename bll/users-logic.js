const dal = require("../dal/dal");

// select username from Users with id
// async function getUserUsername(id) {
//     const sql = `SELECT username FROM Users WHERE userID=${id}`;
//     const users = await dal.execute(sql);
//     users[0].id = id;
//     return users[0];
//     // return users[0].username;
// }

// select username from Users with id
async function getUserDetailsByID(id) {
    const sql = `SELECT username FROM Users WHERE userID=${id}`;
    const users = await dal.execute(sql);
    users[0].id = id;
    return users[0];
}

// Add user:
async function addUser(user) {
    const sql = `INSERT INTO Users(firstName, lastName, username, password)
                VALUES ('${user.firstName}','${user.lastName}','${user.username}','${user.password}')`;
    const info = await dal.execute(sql);
    user.id = info.insertId;
    return user;
}

// check if username exists:
async function isUsernameExists(username) {
    const sql = `SELECT COUNT(*) as count FROM Users Where username='${username}'`;
    const result = (await dal.execute(sql))[0];
    return result.count > 0;
}

// check if username and password are valid:
async function checkLogin(username, password) {
    const sql = `SELECT COUNT(*) as count FROM Users 
                WHERE username COLLATE utf8_bin LIKE '${username}' 
                AND password COLLATE utf8_bin LIKE'${password}'`;
    const result = (await dal.execute(sql))[0];
    return result.count > 0;
}

// get the id of a specific user:
async function getUserDetails(username, password) {
    const sql = `SELECT userID as id, username FROM Users WHERE username='${username}' AND password='${password}'`;
    const userDetails = await dal.execute(sql);
    return userDetails;
}

// logges the user in or out
async function userLoggedInOrOut(obj) {
    if (obj.loggedIn === true) {
        obj.loggedIn = 1;
        const sql = `UPDATE Users SET loggedIn='${obj.loggedIn}' WHERE userId=${obj.userId}`;
        await dal.execute(sql);
    }
    else if (obj.loggedIn === false) {
        obj.loggedIn = 0;
        const sql = `UPDATE Users SET loggedIn='${obj.loggedIn}' WHERE userId=${obj.userId}`;
        await dal.execute(sql);
    }
}

// checkes if user is logged in
async function isUserLoggedIn(id) {
    const sql = `SELECT COUNT(*) as count FROM Users Where loggedIn=1 AND userID=${id}`;
    const result = (await dal.execute(sql))[0];
    if (result.count > 0) {
        return true;
    }
    return false;
}

module.exports = {
    addUser,
    isUsernameExists,
    checkLogin,
    getUserDetails,
    userLoggedInOrOut,
    isUserLoggedIn,
    getUserDetailsByID
};