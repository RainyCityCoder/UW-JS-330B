const express = require("express");

const routes = require("./routes");
// const users = require("./users");
const auth = require("./auth");

const server = express();
server.use(express.json());

function logging(req, res, next) {
  console.log("Request recieved: ", req.url);
  // Can comment these 2 lines out now that we no longer need it.
  // let testToken = auth.createToken("test@test.com");
  // auth.verifyToken(testToken);
  next(); // This allows next thing in stack receives the req., because we don't want to only log things, we want routes to function
}

// Note: server.use(logging) needs to be before server.use(routes) as request is passed in sequence. If server.use(routes) was first, server.use(logging) wouldn't get request as server.use(routes) sends a response & doesn't pass request on (using next()).
server.use(logging); 
// server.use(users);
server.use(routes);

module.exports = server;