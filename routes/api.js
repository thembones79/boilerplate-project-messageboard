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
  useNewUrlParser: true,
  useFindAndModify: false
});
mongoose.set("useCreateIndex", true);
var db = mongoose.connection;

var { addThread, getThreads, reportThread } = require("../models/thread.js");

module.exports = function(app) {
  app
    .route("/api/threads/:board")
    .get(getThreads)
    .post(addThread)
    .put(reportThread);

  app.route("/api/replies/:board");
};
