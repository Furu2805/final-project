const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for a Comment.
 */
const commentSchema = new mongoose.Schema({
    // The text of the comment.
    comment: { type: String, required: true },
    // The date and time when the comment was created.
    date_time: { type: Date, default: Date.now },
    // The ID of the user who created the comment.
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    // The ID of the photo this comment belongs to.
    photo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Photos', required: true }
});

/**
 * Create a Mongoose Model for a Comment using the commentSchema.
 */
const Comment = mongoose.model("Comments", commentSchema);

/**
 * Make this available to our application.
 */
module.exports = Comment;
