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

//var Issue = (module.exports = mongoose.model("Issue", issueSchema, "pupa"));
/*
 text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).
*/


module.exports = {
  methodE: function(req, res) {
    res.send("anal");
  },
  methodF: function(req, res) {
    res.send("anal");
  },
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
  methodG: function(req, res) {
    res.send("oral");
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
  }
};

/*

addThread: function(req,res){
var board = req.params.board;
var thread = {
      text: req.body.text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password,
      replies: []
    };
  var Thread = (module.exports = mongoose.model("Thread", threadSchema, board));
    Thread.create(thread, function(err, data) {
        if (err) {
          res.send(err.message);
          console.log(err);
        }
        res.redirect('/b/'+board+'/');
      });
}

 
  this.newThread = function(req, res) {
    var board = req.params.board;
    var thread = {
      text: req.body.text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password,
      replies: []
    };
    mongo.connect(url,function(err,db) {
      var collection = db.collection(board);
      collection.insert(thread, function(){
        res.redirect('/b/'+board+'/');
      });
    });
  };
  


*/

/*
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
