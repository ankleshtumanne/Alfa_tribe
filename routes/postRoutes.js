const express = require('express');
const postRouter = express.Router();

const User = require('../modules/userModel');
const Post = require('../modules/PostModel');
const Comment=require("../modules/commetModel")
const Authantication = require('../middleware/Authantication');


postRouter.post('/api/posts', Authantication, async (req, res) => {
  const { stockSymbol, title, description, tags } = req.body;
  const userId=req.user._id
  try {
    const newPost = new Post({
      stockSymbol,
      title,
      description,
      tags,
      userId  
    });

    const savedPost = await newPost.save();
    res.status(201).json({ success: true, postId: savedPost._id, message: 'Post created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

postRouter.get('/api/posts',Authantication,async (req, res) => {
  const { stockSymbol, tags, sortBy } = req.query;
  console.log("getting data")
    try {
        let filter = {};
        if (stockSymbol) filter.stockSymbol = stockSymbol;
        if (tags) filter.tags = { $in: tags.split(',') };

        let posts =Post.find(filter);
        // console.log("posts",posts)
        if (sortBy === 'date') posts = posts.sort({ createdAt: -1 });
        if (sortBy === 'likes') posts = posts.sort({ likesCount: -1 });
        
        posts =  posts.select('postId stockSymbol title description likesCount createdAt');
        const result=await posts
        // console.log("result",result)
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

postRouter.get('/api/posts/:postId',Authantication,async (req, res) => {
  // console.log("getting post by id")
  const postId=req.params.postId
  try {
    const post = await Post.findById(postId).populate("comments");
    console.log("post data",post)
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

postRouter.delete('/api/posts/:postId', Authantication, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    
    if (post.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await post.remove();
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

postRouter.get('/api/posts/:postId', Authantication, async (req, res) => {
  const { page = 1, limit = 10, stockSymbol, tags, sortBy } = req.query;

  try {
      let filter = {};
      if (stockSymbol) filter.stockSymbol = stockSymbol;
      if (tags) filter.tags = { $in: tags.split(',') };

      let postsQuery = Post.find(filter);

      if (sortBy === 'date') postsQuery = postsQuery.sort({ createdAt: -1 });
      if (sortBy === 'likes') postsQuery = postsQuery.sort({ likesCount: -1 });

      const totalPosts = await Post.countDocuments(filter);

      
      const posts = await postsQuery
          .limit(parseInt(limit))
          .skip((parseInt(page) - 1) * parseInt(limit))
          .select('postId stockSymbol title description likesCount createdAt');
      
      res.json({
          success: true,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
          posts,
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});
module.exports = postRouter;