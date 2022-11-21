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

async function attachActivitiesToRoutines(routines) {
    const idString = routines.map((el, ind) => {
        return `$${ind + 1}`
    }) .join(", ")
    const idArr = routines.map((el) => {
        return el.id
    })
    try {
        const { rows: activities } = await client.query(`
        SELECT activities.*, routineactivities.duration, routineactivities.count, routineactivities.id AS "routineActivityId", routineactivities."routineId"
        FROM activities
        JOIN routineactivities ON routineactivities."activityId"=activities.id
        WHERE routineactivities."routineId" IN (${idString});
        `, idArr)
        for (const routine of routines) {
            const activitiesToAdd = activities.filter((activity) => {
                return activity.routineId == routine.id
            }
            )
            routine.activities = activitiesToAdd
        }   return routines
    } catch (error) {
        console.log(error)
    }
}

async function getAllRoutines() {
    try {
        const { rows } = await client.query(`
        SELECT routines.*, users.username AS "creatorName" 
        FROM routines
        JOIN users ON routines."creatorId"=users.id;
        `);
        return attachActivitiesToRoutines(rows)
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
        WHERE "isPublic"=true;
        `)
    } catch (error) {
        console.log(error)
    }
}

async function getAllRoutinesByUser({ username }) {
    try {
        const { rows } = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.Id
        WHERE "username"=$1; 
        `, [username]
        );

        return (rows);

    } catch (error) {
        console.log(error)
    }
}

async function getPublicRoutinesByUser({ username }) {
    try {
        const { rows } = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.Id
        WHERE "isPublic"=true AND username=$1;
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
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");
  
    if (setString.length === 0) {
      return;
    }
  
    try {
      const {
        rows: [routine],
      } = await client.query(
        `
        UPDATE routines
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
        return routine;
    } catch (error) {
        console.log(error)
    }
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