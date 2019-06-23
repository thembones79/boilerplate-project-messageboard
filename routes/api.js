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

var {
  addThread,
  addReply,
  getThreads,
  getReplies,
  reportThread,
  reportReply,
  deleteThread,
  deleteReply
} = require("../models/thread.js");

module.exports = function(app) {
  app
    .route("/api/threads/:board")
    .get(getThreads)
    .post(addThread)
    .put(reportThread)
    .delete(deleteThread);

  app
    .route("/api/replies/:board")
    .get(getReplies)
    .post(addReply)
    .put(reportReply)
    .delete(deleteReply);
};
