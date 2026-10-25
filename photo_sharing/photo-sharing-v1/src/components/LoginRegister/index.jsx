import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Paper, Grid, Alert } from "@mui/material";
import './styles.css';
import { use } from "react";

function LoginRegister({ onLogin }) {

    //Toggle
    const [showRegister, setShowRegister] = useState(false);

    // Login
    const [loginName, setLoginName] = useState('')
    const [loginPassword, setLogginPassword] = useState('')
    const [loginError, setLoginError] = useState('')

    //Register
    const [regLoginName, setRegLoginName] = useState('')
    const [regPassword, setRegPassword] = useState('')
    const [regPasswordConfirm, setRegPasswordConfirm] = useState('')
    const [regFirstName, setRegFirstName] = useState('')
    const [regLastName, setRegLastName] = useState('')
    const [regLocation, setRegLocation] = useState('')
    const [regDescription, setRegDescription] = useState('')
    const [regOccupation, setOccupation] = useState('')
    const [regError, setRegError] = useState('')
    const [regSuccess, setRegSuccess] = useState('')


    //Login handler
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('')
        setRegSuccess('')

        try {
            const response = await axios.post(
                '/admin/login', {
                login_name: loginName,
                password: loginPassword
            })
            onLogin(response.data);
        }
        catch (error) {
            setLoginError(error.response?.data?.message || 'Login failed');
        }
    }

    //Register handler
    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError('')

        if (regPassword !== regPasswordConfirm) {
            setRegError('Password do not match');
            return
        }

        if (!regLoginName || !regPassword || !regFirstName || !regLastName) {
            setRegError('Please fill all required fields');
            return
        }

        try {
            const response = await axios.post('/api/register', {
                login_name: regLoginName,
                password: regPassword,
                first_name: regFirstName,
                last_name: regLastName,
                location: regLocation,
                description: regDescription,
                occupation: regOccupation
            })

            setRegSuccess('User created!')

            setLoginName('')
            setLogginPassword('')
            setRegLoginName('')
            setRegPassword('')
            setRegPasswordConfirm('')
            setRegFirstName('')
            setRegLastName('')
            setRegLocation('')
            setRegDescription('')
            setOccupation('')
        }
        catch (error) {
            setRegError(error.response?.data?.message || 'Registration failed');
        }
    }


    return (
        <Box className='login-register-container'>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ padding: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight={5}>
                            Login
                        </Typography>

                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Username"
                                margin="normal"
                                value={loginName}
                                onChange={(e) => setLoginName(e.target.value)}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                margin="normal"
                                value={loginPassword}
                                onChange={(e) => setLogginPassword(e.target.value)}
                                required
                            />
                            {loginError && (
                                <Alert severity="error">
                                    {loginError}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large">
                                Login
                            </Button>

                            {/* An dang ky */}
                            <Button
                                fullWidth
                                variant="outlined"
                                size="large"
                                sx={{ marginTop: 2 }}
                                onClick={() => setShowRegister(!showRegister)}
                            >
                                {showRegister ? 'Hide Registration Form' : 'Create New Account'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {showRegister && (
                    <Grid item xs={12} md={5}>
                        <Paper elevation={3} sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom fontWeight={5}>
                                Register
                            </Typography>

                            <form onSubmit={handleRegister}>
                                <TextField
                                    fullWidth
                                    label="Login Name"
                                    margin="normal"
                                    value={regLoginName}
                                    onChange={(e) => setRegLoginName(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    margin="normal"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    type="password"
                                    margin="normal"
                                    value={regPasswordConfirm}
                                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    margin="normal"
                                    value={regFirstName}
                                    onChange={(e) => setRegFirstName(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    margin="normal"
                                    value={regLastName}
                                    onChange={(e) => setRegLastName(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Location"
                                    margin="normal"
                                    value={regLocation}
                                    onChange={(e) => setRegLocation(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    margin="normal"
                                    value={regDescription}
                                    onChange={(e) => setRegDescription(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    label="Occupation"
                                    margin="normal"
                                    value={regOccupation}
                                    onChange={(e) => setOccupation(e.target.value)}
                                />

                                {regError && (
                                    <Alert severity="error">
                                        {regError}
                                    </Alert>
                                )}

                                {regSuccess && (
                                    <Alert severity="success">
                                        {regSuccess}
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                >
                                    Create Account
                                </Button>
                            </form>
                        </Paper>
                    </Grid>
                )

                }
                {/* Register form */}
            </Grid>
        </Box>
    )
}
export default LoginRegister;