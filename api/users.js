const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
require("dotenv").config();

const { getAllUsers, getUserByUsername, createUser } = require("../db");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

usersRouter.get("/", async (req, res) => {
  const users = await getAllUsers();
  console.log("where am i");
  res.send({
    users,
  });
});

usersRouter.post("/api/users/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      const newToken = jwt.sign(
        {
          username: username,
          id: user.id
        },
        JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({ message: "you're logged in!", newToken });
    } else {
      next({
        name: "LoginError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/api/users/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that name already exists",
      });
    }

    const user = await createUser({
      username,
      password,
    });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "thank you for signing up",
      token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});


usersRouter.get('/api/users/me', async (req, res, next) => {
  try {
    if (!req.user) {
      next({
        name: "InvalidUserError",
        message: "You must be logged in to view your profile"
      })
    } else {
      const user = getUserByUsername(req.user.username);
      res.send({
        user
      })
    }
  } catch ({ name, message }) {
    next({ name, message })
  }
});



usersRouter.get('/api/users/:username/routines', async (req, res, next) => {
  const user = getUserByUsername();

  try {
    if (!req.user) {
      next({
        name: "InvalidUserError",
        message: "You must be logged in to view your profile"
      })
    } else {
      res.send({
        user
      })
    }
  } catch ({ name, message }) {
    next({ name, message })
  }
})




module.exports = usersRouter;



// if(req.user)