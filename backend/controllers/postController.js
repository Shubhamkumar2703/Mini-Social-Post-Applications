const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { text, imageUrl } = req.body;

    if (!text && !imageUrl)
      return res.status(400).json({ msg: "Text or image required" });

    const post = new Post({
      userId: req.user.id,
      username: req.user.name,
      text,
      imageUrl
    });

    await post.save();
    res.json(post);
  } catch {
    res.status(500).send("Server error");
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).send("Server error");
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch {
    res.status(500).send("Server error");
  }
};

exports.commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    post.comments.push({
      userId: req.user.id,
      username: req.user.name,
      text
    });

    await post.save();
    res.json(post);
  } catch {
    res.status(500).send("Server error");
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.userId.toString() !== req.user.id) return res.status(403).json({ msg: "Not authorized" });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "Post deleted" });
  } catch {
    res.status(500).send("Server error");
  }
};