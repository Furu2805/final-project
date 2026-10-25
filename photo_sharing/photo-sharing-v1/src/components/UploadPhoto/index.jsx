import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import axios from "axios"
import "./styles.css";

function UploadPhoto() {
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file)

        try {
            await axios.post('http://localhost:8081/api/photo/new', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            alert('Photo uploaded!')
            window.location.reload();
        }
        catch (err) {
            console.error('Upload failed:', err);
            alert('Error uploading photo: ' + (err.response?.data?.message || err.message));
        }
    }

    return (
        <>
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload-input"
                onChange={handlePhotoUpload}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => document.getElementById('photo-upload-input').click()}
            >
                Add Photo
            </Button>
        </>
    );
}

export default UploadPhoto;