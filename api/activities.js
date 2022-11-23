const express = require('express');
const activityRouter = express.Router();

const {requireUser } = require('./utilities')

const {
    createActivity,
    getAllActivities,
    updateActivity,
    getActivityById,
} = require('../db');

// GET /api/activities/:activityId/routines
activityRouter.get("/api/activities/:activityId/routines", async (req, res) => {
    try {
        const allActivities = await getAllActivities();

        const activities = allActivities.filter(activity => {
            if (activity.active) {
                return true;
            }
            if (req.user && activity.creatorName.id === req.user.id) {
                return true;
            }
            return false;
        });
        console.log("Who are you people");

        res.send({
            activities
        });
    } catch ({ name, message }) {
        next({ name, message })
    }
});

// GET /api/activities
activityRouter.get("/api/activities", async (req, res) => {
    try {
        const allActivities = await getAllActivities();

        const activities = allActivities.filter(activity => {
            if (activity.active) {
                return true;
            }
            if (req.user && activity.creatorName.id === req.user.id) {
                return true;
            }
            return false;
        });
        console.log("Who are you people");

        res.send({
            activities
        });
    } catch ({ name, message }) {
        next({ name, message })
    }
});

// POST /api/activities
activityRouter.post("/api/activities", requireUser, async (req, res, next) =>{
    const { title, content, activities = "" } = req.body;

    const activityArr = activities.trim().split(/\s+/)
    const postData = {};

    if (activityArr.length) {
        postData.activities = activityArr;
    }

    try {
        postData.creatorId = req.user.id;
        postData.title = title;
        postData.content = content;

        const post = await createActivity(postData);

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

// PATCH /api/activities/:activityId
activityRouter.patch('/api/activities/:activityId', requireUser, async (req, res, next) => {
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
        const originalActivity = await getActivityById(activityId);

        if (originalActivity.creatorName.id === req.user.id) {
            const updatedActivity = await updateActivity(activityId, updateFields);
            res.send({ post: updatedActivity })
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


module.exports = activityRouter;