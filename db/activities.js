const client = require("./client");
const { createRoutine } = require("./routines");

// database functions
async function createActivity({ name, description }) {
    try {
        const { rows: [activity] } = await client.query(`
            INSERT INTO activities(name, description)
            VALUES($1, $2)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
        `, [name, description]);

        return activity
    } catch (error) {
        console.log(error)
    }
}


async function getAllActivities() {
  try {
    const { rows } = await client.query(`
    SELECT id, name, description
    FROM activities;
    `);

    return rows;
  } catch (error) {
    console.log(error)
  }
}

async function getActivityById(id) {
    try {
        const { rows: [ activity ] } = await client.query(`
        SELECT id, name, description
        FROM activities
        WHERE id=${id}
        `);

        if (!user) {
            return null
        }
        return activity
    } catch (error) {
        console.log(error)
    }
}

async function getActivityByName(name) {
    try {
        const { rows: [ activity ] } = await client.query(`
        SELECT id, name, description
        FROM activities
        WHERE name=$1
        `, [name])
        return activity
    } catch (error) {
        console.log(error)
    }
}

async function attachActivitiesToRoutines(creatorId, routines) {
  try {
    const createActivityRoutinePromises = routines.map(
      routine => createRoutine(routines)
    );

    await Promise.all(createActivityRoutinePromises);

    return await getActivityById(creatorId);
  } catch (error) {
    console.log(error)
  }
}

async function updateActivity(id, fields = {}) {
  const { name, description } = fields;
  console.log("this is from the updated activity:", fields)
  delete fields.id;
  const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
      console.log("This is set string from updated activity:", setString)
  try {
      if(setString.length > 0) {
          const { rows } = await client.query(`
          UPDATE activities
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
          `, Object.values(fields));
          return rows;
      } 
      if (fields === undefined) {
          return await getActivitiesById(activityId)
      }
  } catch (error) {
      console.log(error)
  }
};

  // don't try to update the id
  // do update the name and description
  // return the updated activity


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};