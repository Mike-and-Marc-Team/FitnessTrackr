const express = require('express');
const router = express.Router();
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db/users.js")

router.use( async (req, res, next) => {
    const prefix = "Bearer "
    const auth = req.header("Authorization")
    if (!auth ) {
        next()
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length)
        try {
        const verifyToken = jwt.verify(
            token,
            JWT_SECRET
            )
            const id = verifyToken.id
            if (id) {{
                req.user = await getUserById();
                next();
            }}
        } catch {
            next();
        }
    } 
    next()
})


// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;