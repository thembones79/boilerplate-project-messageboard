/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var mongoose = require("mongoose");

// Connect to mongoose
mongoose.connect(process.env.DB, {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);
var db = mongoose.connection;

var {
  methodC,
  methodD,
  methodA,
  methodE,
  methodF,
  addThread,
  getThreads
} = require("../models/thread.js");

module.exports = function(app) {
  app
    .route("/api/threads/:board")
    .get(getThreads)
    .post(addThread);

  app.route("/api/replies/:board");
};
