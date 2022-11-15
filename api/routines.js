const express = requre('express');
const routineRouter = express.Router();
const jwt = require("jsonwebtoken");
const {requireUser } = require('./utilities');

const {
    createRoutine,
    getAllRoutine,
    updateRoutine,
    getRoutineById
} = require('../db');

routineRouter.use((req, res, next) =>{
    console.log("Hey, you! You're finally awake.")
    console.log("*Skyrim music starts playing*")

    next();
});


routineRouter.get("/", async (req, res) => {
    const routine = await getAllRoutine();
    console.log("Who are you people");
    res.send({
        users
    })
});

routineRouter.post("/", requireUser, async (req, res, next) =>{
    
})