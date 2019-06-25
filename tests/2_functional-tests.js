/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  var text1 = "Test text for thread1";
  var text2 = "Test text for thread2";
  var thread1_id;
  var thread2_id;
  var replyId;

  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("create 2 threads", function(done) {
        chai
          .request(server)
          .post("/api/threads/tests")
          .send({ text: text1, delete_password: "1234" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
          });
        chai
          .request(server)
          .post("/api/threads/tests")
          .send({ text: text2, delete_password: "5678" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("GET", function() {
      test("last 10 threads with 3 replies", function(done) {
        chai
          .request(server)
          .get("/api/threads/tests")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isBelow(res.body.length, 11);
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "bumped_on");
            assert.property(res.body[0], "text");
            assert.property(res.body[0], "replies");
            assert.notProperty(res.body[0], "reported");
            assert.notProperty(res.body[0], "delete_password");
            assert.isArray(res.body[0].replies);
            assert.isBelow(res.body[0].replies.length, 4);
            thread1_id = res.body[1]._id;
            thread2_id = res.body[0]._id;
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("delete thread with valid password", function(done) {
        chai
          .request(server)
          .delete("/api/threads/tests")
          .send({ thread_id: thread1_id, delete_password: "1234" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });

      test("delete thread with invalid password", function(done) {
        chai
          .request(server)
          .delete("/api/threads/tests")
          .send({ thread_id: thread2_id, delete_password: "1234" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          });
      });
    });

    suite("PUT", function() {
      test("report thread", function(done) {
        chai
          .request(server)
          .put("/api/threads/tests")
          .send({ report_id: thread2_id })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success - thread has been reported");
            done();
          });
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      test("reply to thread", function(done) {
        chai
          .request(server)
          .post("/api/replies/tests")
          .send({
            thread_id: thread2_id,
            text: "reply",
            delete_password: "abcd"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("GET", function() {
      test("Get all replies for chosen thread", function(done) {
        chai
          .request(server)
          .get("/api/replies/tests")
          .query({ thread_id: thread2_id })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, "_id");
            assert.property(res.body, "created_on");
            assert.property(res.body, "bumped_on");
            assert.property(res.body, "text");
            assert.property(res.body, "replies");
            assert.notProperty(res.body, "delete_password");
            assert.notProperty(res.body, "reported");
            assert.isArray(res.body.replies);
            assert.notProperty(res.body.replies[0], "delete_password");
            assert.notProperty(res.body.replies[0], "reported");
            assert.equal(
              res.body.replies[res.body.replies.length - 1].text,
              "reply"
            );

            replyId = res.body.replies[0]._id;

            done();
          });
      });
    });

    suite("PUT", function() {
      test("report reply", function(done) {
        chai
          .request(server)
          .put("/api/replies/tests")
          .send({ thread_id: thread2_id, reply_id: thread2_id })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success - reply has been reported");
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("delete reply with invalid password", function(done) {
        chai
          .request(server)
          .delete("/api/threads/tests")
          .send({
            thread_id: thread2_id,
            reply_id: replyId,
            delete_password: "12345"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          });
      });

      test("delete reply with valid password", function(done) {
        chai
          .request(server)
          .delete("/api/replies/tests")
          .send({
            thread_id: thread2_id,
            reply_id: replyId,
            delete_password: "abcd"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });
  });
});
