const client = require('./client')

async function getRoutineActivityById(id){
    try {
        const { rows: [ routine_activities ] } = await client.query(`
        SELECT "activityId"
        FROM routineactivities
        WHERE id=${ id }
        `)
        return routine_activities 
    } catch (error) {
        console.log(error)
    }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
    try {
      const { rows: [ activity ] } = await client.query(`
      INSERT INTO routineactivities("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `, [routineId, activityId, count, duration]);

      return activity
    } catch (error) {
        throw error;
    }
}

async function getRoutineActivitiesByRoutine({id}) {
  try {
    const { rows: [routineActivities] } = await client.query(`
      SELECT *
      FROM routineactivities
      WHERE id=$1;
    `[id]);
    if(!routineActivities){
      throw error
      };
    
    return routineActivities
  } catch (error) {
    console.log(error)
  }
}

async function updateRoutineActivity (id, fields = {}) {
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
      throw error;
    }
  }



async function destroyRoutineActivity(id) {
  await client.query(`
    DELETE FROM routineactivities
    WHERE "routineId"=$1
    `, [id]);
    await client.query(`
    DELETE FROM activities
    WHERE id=$1
    `,[id]);
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows: [routine] } = await client.query(`
    SELECT *
    FROM routineactivities
    JOIN routines ON routineactivities."routineId"=routines.id AND routineactivities.id=${routineActivityId}; 
    `)
    return routine.creatorId == userId
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};