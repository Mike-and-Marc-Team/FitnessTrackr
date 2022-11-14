const client = require("./client");

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


async function getAllActivities({ name, description }) {
  try {
    const { rows } = await client.query(`
    SELECT id, name, description
    FROM activities;
    `, [name, description]);

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
    } catch (error) {
        console.log(error)
    }
}

async function attachActivitiesToRoutines(routines) {
   
}

async function updateActivity({ id, fields = {} }) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
    
      // return early if this is called without fields
      if (setString.length === 0) {
        return;
      }
    
      try {
        const { rows: [ activity ] } = await client.query(`
          UPDATE activities
          SET ${ setString }
          WHERE id=${ id }
          RETURNING *;
        `, Object.values(fields));
    
        return activity;
      } catch (error) {
        throw error;
      }
    }
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