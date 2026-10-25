import React, { useEffect, useState } from "react";
import { Typography, Button, Card, CardContent, TextField, Box, Alert, CircularProgress } from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function renderDescription(description = "") {
    return description.split(/(<i>[\s\S]*?<\/i>)/gi).map((part, index) => {
        const italicText = part.match(/^<i>([\s\S]*?)<\/i>$/i);

        return italicText ? (
            <i key={index}>{italicText[1]}</i>
        ) : (
            <React.Fragment key={index}>{part}</React.Fragment>
        );
    });
}

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail({ currentUser, onLogout }) {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        location: '',
        description: '',
        occupation: ''
    });

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setLoadError(null);

        axios.get(`/api/user/${userId}`, {
            signal: controller.signal,
            timeout: 15000
        })
            .then((response) => {
                setUser(response.data);
                setFormData(response.data);
            })
            .catch((error) => {
                if (axios.isCancel(error)) return;
                console.error("Error loading user detail:", error);
                setLoadError({
                    status: error.response?.status,
                    message: error.response?.status === 401
                        ? "Your login session expired. Log in again to continue."
                        : error.response?.data?.message || "Could not load the profile. Check the backend, then retry."
                });
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [userId, retryCount]);

    const handleSave = async () => {
        try {
            await axios.put(`/api/user/${userId}`, formData, { withCredentials: true });
            setUser(formData);
            setEditing(false);
            alert('Profile updated!');
        } catch (error) {
            alert('Update failed: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) {
        return <Box display="flex" alignItems="center" gap={1} padding={3}>
            <CircularProgress size={20} />
            <Typography>Loading profile...</Typography>
        </Box>;
    }

    if (loadError) {
        const handleLoginAgain = () => {
            onLogout?.();
            navigate("/login", { replace: true });
        };

        return <Box padding={3}>
            <Alert severity="error">{loadError.message}</Alert>
            {loadError.status === 401 ? (
                <Button variant="contained" onClick={handleLoginAgain} sx={{ mt: 2 }}>
                    Log in again
                </Button>
            ) : (
                <Button variant="contained" onClick={() => setRetryCount((count) => count + 1)} sx={{ mt: 2 }}>
                    Retry
                </Button>
            )}
        </Box>;
    }

    if (!user) {
        return <Alert severity="error">Profile data was empty. Please retry.</Alert>;
    }

    const isOwnProfile = currentUser && currentUser._id === userId;

    return (
        <Card>
            <CardContent>
                {editing ? (
                    <Box>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Occupation"
                            value={formData.occupation}
                            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                            margin="normal"
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" onClick={handleSave} sx={{ mr: 1 }}>Save</Button>
                            <Button onClick={() => { setEditing(false); setFormData(user); }}>Cancel</Button>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Typography variant="h5">
                            {user.first_name} {user.last_name}
                        </Typography>
                        <Typography color="textSecondary">
                            Location: {user.location}
                        </Typography>
                        <Typography color="textSecondary">
                            Description: {renderDescription(user.description)}
                        </Typography>
                        <Typography color="textSecondary">
                            Occupation: {user.occupation}
                        </Typography>
                        <Typography color="primary" variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
                            Photos: {user.photo_count || 0}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to={`/photos/${userId}`}
                                sx={{ mr: 1 }}
                            >
                                View Photos
                            </Button>
                            {isOwnProfile && (
                                <Button variant="outlined" onClick={() => setEditing(true)}>
                                    Edit Profile
                                </Button>
                            )}
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default UserDetail;
