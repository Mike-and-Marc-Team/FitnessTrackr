const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
    try {
        const { rows: [ routine ] } = await client.query(`
        INSERT INTO routines("creatorId", "isPublic", name, goal)
        VALUES($1, $2, $3, $4)
        RETURNING *;
        `, [creatorId, isPublic, name, goal])
        return routine
    } catch (error) {
        console.log(error)
    }
}

async function getRoutineById(id) {
    try {
        const { rows: [ routine ] } = await client.query(`
        SELECT *
        FROM routines
        WHERE id=$1;
        `, [id])
        return routine
    } catch (error) {
        console.log(error)
    }

}

async function getRoutinesWithoutActivities() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM routines
        `)
        if (!rows) {
            return null;
        }
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function getAllRoutines() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM routines;
        `);
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function getAllPublicRoutines() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM routines
        JOIN users ON routines."creatorId"=users.id
        `)
    } catch (error) {
        console.log(error)
    }
}

async function getAllRoutinesByUser({ username }) {
    try {
        const { rows: [routineIds] } = await client.query(`
        SELECT *
        FROM routines
        WHERE "creatorId"=${username} 
        `);

        const routines = await Promise.all(routineIds.map(
            routine => getRoutineById( routine.id)
        ));

        return routines

    } catch (error) {
        console.log(error)
    }
}

async function getPublicRoutinesByUser({ username }) {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM routines
        WHERE "isPublic"=true
        `, [username]);
        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function getPublicRoutinesByActivity({ id }) {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM routines
        JOIN users ON routines."creatorId"=usersId
        JOIN routineactivities ON routineactivities."routineId"=routines.id
        WHERE "isPublic"=true AND routineactivities."activityId"=$1;
        `, [id])
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function updateRoutine(id, fields = {}) {
    const setString = Object.keys(fields)
    

}

async function destroyRoutine(id) {
    await client.query(`
    DELETE FROM routineactivities
    WHERE "routineId"=$1
    `, [id]);
    await client.query(`
    DELETE FROM routines
    WHERE id=$1
    `,[id]);
}

module.exports = {
    getRoutineById,
    createRoutine,
    updateRoutine,
    destroyRoutine,
    getAllRoutines,
    getRoutinesWithoutActivities,
    getAllRoutinesByUser,
    getAllPublicRoutines,
    getPublicRoutinesByActivity,
    getPublicRoutinesByUser
};