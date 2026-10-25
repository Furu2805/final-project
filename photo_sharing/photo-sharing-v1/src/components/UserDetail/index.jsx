import React, { useEffect, useState } from "react";
import { Typography, Button, Card, CardContent, TextField, Box } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail({ currentUser }) {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        location: '',
        description: '',
        occupation: ''
    });

    useEffect(() => {
        axios.get(`/api/user/${userId}`)
            .then((response) => {
                setUser(response.data);
                setFormData(response.data);
            })
            .catch((error) => {
                console.error("Error loading user detail:", error);
            });
    }, [userId]);

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

    if (!user) {
        return <Typography>Loading...</Typography>
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
                            Description: {user.description}
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
