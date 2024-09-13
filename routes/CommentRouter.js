const express = require('express');
const Authantication = require('../middleware/Authantication');
const User = require('../modules/userModel');
const Post = require('../modules/PostModel');
const CommentRouter =express.Router()
const Comment=require("../modules/commetModel.js")
const mongoose = require('mongoose');
CommentRouter.post('/api/posts/:postId/comments', Authantication, async (req, res) => {
    const { comment } = req.body;
    try {
       
        const post = await Post.findById(req.params.postId);
        // console.log(post)
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
            return res.status(400).json({ message: 'Invalid postId' });
        }
        let newComment = new Comment({comment,userId: req.user._id,postId: post._id });
        console.log("newcomment",newComment)
        await newComment.save();
        
        res.json({ success: true, commentId: newComment._id, message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
CommentRouter.delete('/api/:postId/comments/:commentId', Authantication, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
        await post.save();

        res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = CommentRouter;