const express = require("express");
const multer = require("multer");
const path = require("path");
const { fetchUser } = require("../middlewares/auth");
const {
  addNewPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  likePost,
  addCommentsInPost,
} = require("../controllers/postController");
const router = express.Router();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post("/posts", fetchUser, upload.single("image"), addNewPost);
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);
router.put("/posts/:id", fetchUser, updatePostById);
router.delete("/posts/:id", fetchUser, deletePostById);
router.post("/posts/:id/like", likePost);
router.post("/posts/:id/comment", fetchUser, addCommentsInPost);

module.exports = router;
