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
        console.log({ d1: data });
        console.log({ d2: data[0] });
        res.json(data[0]);
      });
  },

  /*
  
 this.replyList = function(req, res) {
    var board = req.params.board;
    mongo.connect(url,function(err,db) {
      var collection = db.collection(board);
      collection.find({_id: new ObjectId(req.query.thread_id)},
      {
        reported: 0,
        delete_password: 0,
        "replies.delete_password": 0,
        "replies.reported": 0
      })
      .toArray(function(err,doc){
        res.json(doc[0]);
      });
    });
  };
  
  
*/

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
      console.log({ data1: data });
      console.log({ rep1: data.replies });
      data.bumped_on = new Date();
      data.replies.push(reply);
      console.log({ data2: data });
      console.log({ rep2: data.replies });
      data.save(function(err, data) {
        if (err) {
          res.send(err.message);
          console.log(err);
        }
        console.log({ data3: data });
        console.log({ rep3: data.replies });
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
      console.log({ data1: data });
      console.log({ rep1: data.replies });
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
  }
};

/*
 
*/

/*
// Get Issues
module.exports.getIssuesByQueryObject = function(queryObject, callback) {
  Thread.find(queryObject, callback);
};

//Add Issue
module.exports.addIssue = function(issue, callback) {
  Issue.create(issue, callback);
};

//Update Issue
module.exports.updateIssue = function(id, issue, options, callback) {
  var query = { _id: id };
  Issue.findOneAndUpdate(query, issue, options, callback);
};

//Delete Issue
module.exports.deleteIssue = function(id, callback) {
  var query = { _id: id };
  Issue.deleteOne(query, callback);
};
*/
