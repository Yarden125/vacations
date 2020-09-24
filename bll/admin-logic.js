const dal = require("../dal/dal");
const hash = require("./hash");

// Get username from admin
async function getAdminDetails(){
    const sql = `SELECT username FROM Admin`;
    const admin = await dal.execute(sql);
    return admin[0].username;
} 

// Check if admin is logged in
async function isAdminLoggedIn(){
    const sql = `SELECT COUNT(*) as count FROM Admin Where loggedIn=1`;
    const result = (await dal.execute(sql))[0];
    if(result.count > 0){
        return true;
    }
    return false;
}

// Check if username and password are correct for admin
async function isAdminExist(login){
    login.password = hash(login.password);
    const sql = `SELECT COUNT(*) as count FROM Admin 
                WHERE username COLLATE utf8_bin LIKE '${login.username}' 
                AND password COLLATE utf8_bin LIKE'${login.password}'`;
    const result = (await dal.execute(sql))[0];
    if(result.count > 0){
        return true;
    }
    return false;
}

// Logges the admin in or out
async function adminLoggedInOrOut(obj){
    if(obj===true){
        obj=1;
        const sql= `UPDATE Admin SET loggedIn='${obj}'`;
        await dal.execute(sql);
    }
    else if(obj===false){
        obj=0;
        const sql= `UPDATE Admin SET loggedIn='${obj}'`;
        await dal.execute(sql);
    }
}

module.exports = {
    getAdminDetails,
    isAdminExist,
    adminLoggedInOrOut,
    isAdminLoggedIn
};