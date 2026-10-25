import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Avatar,
  CircularProgress,
  TextField
} from "@mui/material";
import CommentForm from "../CommentForm";
import "./styles.css";

function UserPhotos({ currentUser }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchPhotos();
  }, [userId]);

  const fetchPhotos = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const response = await axios.get(`/api/photo/photosOfUser/${userId}`);
      setPhotos(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("Failed to load photos");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/commentsOfPhoto/${commentId}`, {
        withCredentials: true
      })
      fetchPhotos(false)
    }
    catch (err) {
      alert("Error deleting comment: " + (err.response?.data?.message || err.message))
    }
  }

  const handleUpdateComment = async (commentId) => {
    try {
      await axios.put(`/api/commentsOfPhoto/${commentId}`,
        { comment: editText.trim() },
        { withCredentials: true }
      );
      setEditId(null);
      setEditText("");
      fetchPhotos(false);
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
  }

  const handleCommentAdded = () => {
    fetchPhotos(false);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (photos.length === 0) {
    return (
      <Box padding={3}>
        <Typography>No photos found for this user.</Typography>
      </Box>
    );
  }

  return (
    <Box className="user-photos-container">
      {photos.map((photo) => (
        <Card key={photo._id} className="photo-card" sx={{ mb: 3 }}>
          {/* PHOTO IMAGE */}
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`}
            alt={photo.file_name}
            sx={{ maxHeight: 600, objectFit: 'contain' }}
          />

          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Posted on {formatDateTime(photo.date_time)}
            </Typography>

            {photo.comments && photo.comments.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Comments ({photo.comments.length})
                </Typography>

                {photo.comments.map((comment) => (
                  <div key={comment._id} style={{ marginBottom: "15px", paddingLeft: "10px", borderLeft: "3px solid #e0e0e0" }}>
                    <Typography variant="body2">
                      <Link
                        to={`/users/${comment.user._id}`}
                        style={{ textDecoration: 'none', fontWeight: 'bold', color: '#1976d2' }}
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                      <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '8px' }}>
                        {formatDateTime(comment.date_time)}
                      </span>
                    </Typography>

                    {editId === comment._id ? (
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <Button
                          size="small"
                          onClick={() => handleUpdateComment(comment._id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="body1" style={{ marginTop: "5px" }}>
                          {comment.comment}
                        </Typography>
                        {currentUser && currentUser._id === comment.user._id && (
                          <Box>
                            <Button
                              size="small"
                              onClick={() => {
                                setEditId(comment._id);
                                setEditText(comment.comment);
                              }}
                            >
                              Edit
                            </Button>
                             <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeleteComment(comment._id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </Box>
            )}

            <CommentForm
              photoId={photo._id}
              onCommentAdded={handleCommentAdded}
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;
