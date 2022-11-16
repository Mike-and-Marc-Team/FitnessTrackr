const client = require('./client')

async function getRoutineActivityById(id){
    try {
        const { rows: [ routine_activities ] } = await client.query(`
        SELECT activityId
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
}

async function updateRoutineActivity ({id, ...fields}) {
}

async function destroyRoutineActivity(id) {
}

async function canEditRoutineActivity(routineActivityId, userId) {
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};