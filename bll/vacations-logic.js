const dal = require("../dal/dal");

// Get all Vacations:
async function getAllVacations() {
    const sql = `SELECT VacationID as id, description, destination, image, start, end, price FROM Vacations 
                ORDER BY vacationID DESC`;
    return await dal.execute(sql);
}

// Get one vacation by vacation's id:
async function getOneVacation(id) {
    const sql = `SELECT VacationID as id, description, destination, image, start, end, price FROM Vacations 
                WHERE vacationID=${id}`;
    const vacations = await dal.execute(sql);
    return vacations[0];
}

// Add a vaction:
async function addVacation(vacation, image) {
    const sql = `INSERT INTO Vacations(description, destination, image, start, end, price)
                VALUES ('${vacation.description}','${vacation.destination}','${image}',
                '${vacation.start}','${vacation.end}',${vacation.price})`;
    const info = await dal.execute(sql);
    vacation.id = info.insertId;
    return vacation.id;
}

// Update full vacation:
async function updateFullVacation(vacation, image) {
    const sql = `UPDATE Vacations SET description='${vacation.description}', destination='${vacation.destination}', 
                image='${image}', start='${vacation.start}', end='${vacation.end}', price=${vacation.price}
                WHERE vacationID=${vacation.id}`;
    await dal.execute(sql);
    return vacation.id;
}

// Delete vacation by vacation's id
async function deleteVacation(vacationID) {
    const sqlfollowed = `DELETE FROM Followed WHERE vacationID=${vacationID}`;
    const sql = `DELETE FROM Vacations WHERE vacationID=${vacationID}`;
    await dal.execute(sqlfollowed);
    await dal.execute(sql);
}

module.exports = {
    getAllVacations,
    getOneVacation,
    addVacation,
    updateFullVacation,
    deleteVacation,
};