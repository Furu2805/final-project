import React, { useState } from "react";
import { TextField, Button, Box, Alert } from "@mui/material";
import axios from "axios";
import "./styles.css";

function CommentForm({ photoId, onCommentAdded }) {
    const [comment, setComment] = useState("");
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!comment.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await axios.post(`/api/commentsOfPhoto/${photoId}`, {
                comment: comment.trim()
            });

            setSuccess('Comment added!');
            setComment('');

            if (onCommentAdded) {
                onCommentAdded();
            }

            setTimeout(() => setSuccess(''), 2000);

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box className="comment-form">
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={submitting}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting || !comment.trim()}
                >
                    {submitting ? 'Adding...' : 'Add Comment'}
                </Button>
            </form>
        </Box>
    )
}

export default CommentForm;