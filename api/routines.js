const express = requre('express');
const routineRouter = express.Router();
const jwt = require("jsonwebtoken");
const {requireUser } = require('./utilities');

const {
    createRoutine,
    getAllRoutines,
    updateRoutine,
    destroyRoutine,
    getRoutineById,
    addActivities
} = require('../db');

routineRouter.use((req, res, next) =>{
    console.log("Hey, you! You're finally awake.")
    console.log("*Skyrim music starts playing*")

    next();
});


routineRouter.get("/", async (req, res) => {
    try {
        const allRoutines = await getAllRoutines();

        const routines = allRoutines.filter(routine => {
            if (routine.active) {
                return true;
            }
            if (req.user && routine.author.id === req.user.id) {
                return true;
            }
            return false;
        });
        console.log("Who are you people");

        res.send({
            routines
        });
    } catch ({ name, message }) {
        next({ name, message })
    }
});

routineRouter.post("/", requireUser, async (req, res, next) =>{
    const { title, content, activities = "" } = req.body;

    const activityArr = activities.trim().split(/\s+/)
    const postData = {};

    if (activityArr.length) {
        postData.activities = activityArr;
    }

    try {
        postData.authorId = req.user.id;
        postData.title = title;
        postData.content = content;

        const post = await createRoutine(postData);

        if (post) {
            res.send(post);
        } else {
            next({
                name: "PostCreationError",
                message: "There was an error creating your post. Please try again."
            })
        }
    } catch ({name, message}) {
        next({name, message});
    }
});

routineRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
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
        const originalRoutine = await getRoutineById(routineId);

        if (originalRoutine.author.id === req.user.id) {
            const updatedRoutine = await updateRoutine(routineId, updateFields);
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

routineRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    try {
        const routine = await getRoutineById(req.params.routineId);

        if (routine && routine.author.id === req.user.id) {
            const updatedRoutine = await destroyRoutine(routine.id, { active: false });

            res.send({ post: updatedRoutine});
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

routineRouter.post('/:routineId/activities', requireUser, async (req, res, next) => {
    const { title, content, activities = "" } = req.body;

    const activitiesArr = activities.trim().split(/\s+/)
    const activityData = {};

    if (activitiesArr.length) {
        activityData.activities = activitiesArr;
    }

    try {
        const activity = await addActivities(req.params.routineId)


    } catch (error) {
        


    }
})

module.exports = routineRouter;