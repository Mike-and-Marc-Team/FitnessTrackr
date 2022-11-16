const express = require('express');
const routineActivitiesRouter = express.Router();

const { requireUser } = require('./utilities');

const {
    updateActivity,
    deleteActivity
} = require('../db');

routineActivitiesRouter.patch('/routine_activities/:routineActivityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { title, content, activities } = req.body;

    const updateFields = {}

    if (activities && activities.length > 0) {
        updateFields.activities = activities.trim().split(/\s+/);
    }
    if (title) {
        updateFields.title = title;
    }
    if (content) {
        updateFields.content = content;
    }

    try {
        const originalRoutine = await getRoutineById(activityId);

        if (originalRoutine.author.id === req.user.id) {
            const updatedRoutine = await updateActivity(activityId, updateFields);
            res.send({ post: updatedRoutine })
        } else {
            next({
                name: "UnauthorizedUserError",
                message: "You cannot update a post that is not yours"
            })
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

routineActivitiesRouter.delete('/routine_activities/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const activity = await getRoutineById(req.params.routineActivityId);

        if (activity && routine.author.id === req.user.id) {
            const updatedActivity = await deleteActivity(routine.id, { active: false });

            res.send({ post: updatedActivity});
        } else {
            next(post ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a post which is not yours"
            } : {
                name: "PostNotFoundError",
                message: "That post does not exist"
            });
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});




module.exports = routineActivitiesRouter;