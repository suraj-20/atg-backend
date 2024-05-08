const Post = require("../models/postModel");

module.exports.addNewPost = async (req, res) => {
  const { title, content, description } = req.body;

  try {
    const newPost = new Post({ title, content, description });
    if (req.file) {
      newPost.image = req.file.path;
    }
    await newPost.save();

    res
      .status(200)
      .json({ message: "Post Added Successfully", newPost: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ allPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post: post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.updatePostById = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ updatedPost: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.deletePostById = async (req, res) => {
  const { id } = req.params;

  console.log(id);
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.likePost = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json({ updatedPost: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.addCommentsInPost = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.comments.push({ comment });
    await post.save();

    res
      .status(200)
      .json({ message: "Comment added successfully", comments: post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
