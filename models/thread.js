var mongoose = require("mongoose");

// Thread Schema
var threadSchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  bumped_on: {
    type: Date,
    default: Date.now
  },
  delete_password: {
    type: String,
    required: true
  },
  reported: {
    type: Boolean,
    default: false
  },
  replies: {
    type: Array
  },
  replycount: {
    type: Number
  }
});

// Reply Schema
var replySchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  delete_password: {
    type: String,
    required: true
  },
  reported: {
    type: Boolean,
    default: false
  }
});

module.exports = {
  getThreads: function(req, res) {
    var board = req.params.board;
    var Thread = (module.exports = mongoose.model(
      "Thread",
      threadSchema,
      board
    ));

    Thread.find({})
      .sort({ bumped_on: -1 })
      .limit(10)
      .select({
        reported: 0,
        delete_password: 0,
        "replies.delete_password": 0,
        "replies.reported": 0
      })
      .exec(function(err, data) {
        data.forEach(function(doc) {
          doc.replycount = doc.replies.length;
          if (doc.replies.length > 3) {
            doc.replies = doc.replies.slice(-3);
          }
        });

        res.json(data);
      });
  },

  getReplies: function(req, res) {
    var board = req.params.board;
    var id = req.query.thread_id;
    var Thread = (module.exports = mongoose.model(
      "Thread",
      threadSchema,
      board
    ));
    Thread.find({ _id: id })
      .select({
        reported: 0,
        delete_password: 0,
        "replies.delete_password": 0,
        "replies.reported": 0
      })
      .exec(function(err, data) {
        if (err) {
          res.send(err.message);
          console.log(err);
        }

        res.json(data[0]);
      });
  },

  addThread: function(req, res) {
    var board = req.params.board;
    var thread = {
      text: req.body.text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password,
      replies: []
    };
    var Thread = (module.exports = mongoose.model(
      "Thread",
      threadSchema,
      board
    ));
    Thread.create(thread, function(err, data) {
      if (err) {
        res.send(err.message);
        console.log(err);
      }
      res.redirect("/b/" + board + "/");
    });
  },

  addReply: function(req, res) {
    var board = req.params.board;
    var Reply = (module.exports = mongoose.model("Reply", replySchema, board));
    var Thread = (module.exports = mongoose.model(
      "Thread",
      threadSchema,
      board
    ));
    var reply = new Reply({
      text: req.body.text,
      created_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password
    });
    var id = req.body.thread_id;

    Thread.findById(id, function(err, data) {
      if (err) {
        res.send(err.message);
        console.log(err);
      }

      data.bumped_on = new Date();
      data.replies.push(reply);

      data.save(function(err, data) {
        if (err) {
          res.send(err.message);
          console.log(err);
        }

        res.redirect("/b/" + board + "/" + req.body.thread_id);
      });
    });
  },

  reportThread: function(req, res) {
    var board = req.params.board;
    var id = req.body.report_id;
    var Thread = (module.exports = mongoose.model(
      "Thread",
      threadSchema,
      board
    ));
    Thread.findOneAndUpdate(
      { _id: id },
      { reported: true },
      { new: true },
      function(err, data) {
        if (err) {
          res.send(err.message);
          console.log(err);
        }

        res.send("success - thread has been reported");
      }
    );
  },

  reportReply: function(req, res) {
    var board = req.params.board;
    var id = req.body.thread_id;
    var reply_id = req.body.reply_id;
    var Thread = (module.exports = mongoose.model(
      "Thread",
      threadSchema,
      board
    ));
    Thread.findById(id, async function(err, data) {
      if (err) {
        console.log(err);
        res.send(err.message);
      }

      data.replies.forEach(function(reply) {
        if (reply._id == reply_id) {
          reply.reported = true;
        }
      });

      data.markModified("replies");
      await data.save(function(err, data) {
        if (err) {
          res.send(err.message);
          console.log(err);
        }

        res.send("success - reply has been reported");
      });
    });
  },

  deleteThread: function(req, res) {
    var board = req.params.board;
    var id = req.body.thread_id;
    var delete_password = req.body.delete_password;
    var Thread = (module.exports = mongoose.model(
      "Thread",
      threadSchema,
      board
    ));

    Thread.findById(id, function(err, data) {
      if (err) {
        res.send(err.message);
        console.log(err);
      }

      if (data.delete_password !== delete_password) {
        res.send("incorrect password");
      } else {
        Thread.deleteOne({ _id: id }, function(err, data) {
          if (err) {
            res.send(err.message);
            console.log(err);
          }
          res.send("success");
        });
      }
    });
  },
  deleteReply: function(req, res) {
    var board = req.params.board;
    var id = req.body.thread_id;
    var reply_id = req.body.reply_id;
    var delete_password = req.body.delete_password;
    var Thread = (module.exports = mongoose.model(
      "Thread",
      threadSchema,
      board
    ));
    Thread.findById(id, function(err, data) {
      if (err) {
        console.log(err);
        res.send(err.message);
      }
      data.replies.forEach(function(reply) {
        if (reply._id == reply_id) {
          if (reply.delete_password == delete_password) {
            reply.text = "[deleted]";
          } else {
            res.send("incorrect password");
          }
        }
      });
      data.markModified("replies");
      data.save(function(err, data) {
        if (err) {
          res.send(err.message);
          console.log(err);
        }

        res.send("success");
      });
    });
  }
};
