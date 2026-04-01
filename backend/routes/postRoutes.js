const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createPost,
  getPosts,
  likePost,
  commentPost,
  deletePost
} = require("../controllers/postController");

router.post("/", auth, createPost);
router.get("/", auth, getPosts);
router.put("/:id/like", auth, likePost);
router.post("/:id/comment", auth, commentPost);
router.delete("/:id", auth, deletePost);

module.exports = router;