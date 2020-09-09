const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
const usersRouter = require("./users/users-router");
const db = require("./database/config");
const server = express();
const port = process.env.PORT || 6936;

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(
  session({
    resave: false, //avoids recreating sessions that have not changed
    saveUninitialized: false, //to comply with GDPR laws
    secret: "keep it secret, keep it safe", //crpytographically sign the cookie
    store: new knexSessionStore({
      knex: db, //configured instance of knex
      createtable: true, // if the sessions table doesnt exist, create it automatically
    }),
  })
);

server.use(usersRouter);

server.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    message: "something went wrong",
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
