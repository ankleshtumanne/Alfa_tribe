const express = require('express');
const Authantication = require('../middleware/Authantication');
const Post = require('../modules/PostModel');
const likeRouter = express.Router();


likeRouter.post('/api/:postId/like', Authantication, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.likesCount += 1;
        await post.save();

        res.json({ success: true, message: 'Post liked' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


likeRouter.delete('/api/:postId/like', Authantication, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.likesCount = Math.max(0, post.likesCount - 1);
        await post.save();

        res.json({ success: true, message: 'Post unliked' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = likeRouter;
