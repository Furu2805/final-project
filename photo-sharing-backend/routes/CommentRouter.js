const express = require('express');
const router = express.Router();
const Comment = require('../db/commentModel');

// API thêm comment cho photo
router.post('/:photo_id', async (req, res) => {
    const { comment } = req.body;

    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'You must be logged in to comment' });
    }

    if (!comment || !comment.trim()) {
        return res.status(400).json({ message: 'Blank comment is not allowed' });
    }

    try {
        const newComment = await Comment.create({
            comment: comment.trim(),
            user_id: req.session.user._id,
            photo_id: req.params.photo_id,
            date_time: new Date()
        });

        return res.status(200).json({
            message: 'Comment added successfully',
            comment: newComment
        });
    } catch (error) {
        console.error('Comment error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

//api xoá cmt
router.delete('/:comment_id', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({message: 'Authorization required'});
    }
    try {
        const comment = await Comment.findById(req.params.comment_id);
        if (!comment) {
            return res.status(404).json({message: 'Comment not found'});
        }
        if (comment.user_id.toString() !== req.session.user._id) {
            return res.status(403).json({message: 'You can only delete your own comments'});
        }
        await Comment.findByIdAndDelete(req.params.comment_id);
        return res.status(200).json({message: 'Comment deleted successfully'});
    }
    catch (error) {
        console.error('Delete comment error:', error);
        return res.status(500).json({message: 'Server error'});
    }
})

//api sửa cmt
router.put('/:comment_id', async (req, res) => {
    const {comment} = req.body;
    if (!req.session || !req.session.user) {
        return res.status(401).json({message: 'Authorization required'});
    }
    try {
        const oldComment = await Comment.findById(req.params.comment_id);
        if (!oldComment) {
            return res.status(404).json({message: 'Comment not found'});
        }
        if (oldComment.user_id.toString() !== req.session.user._id) {
            return res.status(403).json({message: 'You can only edit your own comments'});
        }
        oldComment.comment = comment;
        await oldComment.save();
        return res.status(200).json({message: 'Comment updated successfully', comment: oldComment});
    }
    catch (error) {
        console.error('Update comment error:', error);
        return res.status(500).json({message: 'Server error'});
    }
})


module.exports = router;