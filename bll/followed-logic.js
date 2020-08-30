const dal = require("../dal/dal");

// get all user's followed vacation
async function getAllFollowedVacations(id){
    const sql = `SELECT vacationID, userID FROM Followed WHERE userID=${id}`;
    const followed = await dal.execute(sql);
    return followed;
}

// Add to followed table in database the userId and the vacationId
async function addFollowedVacation(followed){
    const sql = `INSERT INTO Followed(userID, vacationID) VALUES ('${followed.userID}','${followed.vacationID}')`;
    return await dal.execute(sql);
}

// Removes from followed table in database the userId and the vacationId
async function unfollowVacation(obj){
    const sql = `DELETE FROM Followed WHERE userID='${obj.userID}' AND vacationID='${obj.vacationID}'`;
    await dal.execute(sql);
}

module.exports = {
    getAllFollowedVacations,
    addFollowedVacation,
    unfollowVacation
};