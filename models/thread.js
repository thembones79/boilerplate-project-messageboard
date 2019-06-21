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

    Thread.find({}, function(err, data) {
      if (err) {
        res.send(err.message);
        console.log(err);
      }
      res.json(data);
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
  }
};

/*

  //reported_id name
  this.reportThread = function(req, res) {
    var board = req.params.board;
    mongo.connect(url,function(err,db) {
      var collection = db.collection(board);
      collection.findAndModify(
        {_id: new ObjectId(req.body.report_id)},
        [],
        {$set: {reported: true}},
        function(err, doc) {});
    });
    res.send('reported');
  };














this.threadList = function(req, res) {
    var board = req.params.board;
    mongoose.connect("url",function(err,db) {
      var collection = db.collection(board);
      collection.find(
        {},
        {
          reported: 0,
          delete_password: 0,
          "replies.delete_password": 0,
          "replies.reported": 0
        })
      .sort({bumped_on: -1})
      .limit(10)
      .toArray(function(err,docs){
        docs.forEach(function(doc){
          doc.replycount = doc.replies.length;
          if(doc.replies.length > 3) {
            doc.replies = doc.replies.slice(-3);
          }
        });
        res.json(docs);
      });
    });
  };






















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
