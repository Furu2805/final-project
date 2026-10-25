const express = require('express')
const router = express.Router()
const User = require('../db/userModel')

//Login api
router.post('/login', async (req, res) => {
    const { login_name,
        password
    } = req.body;

    if (!login_name || !password) {
        return res.status(400).json({ message: 'Login name and password is required' });
    }

    try {
        const user = await User.findOne({ login_name: login_name });

        if (!user) {
            return res.status(400).json({ message: 'Wrong username or password' });
        }

        if (user.password !== password) {
            res.status(400).json({ message: 'Wrong username or password' });
        }

        req.session.user = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            login_name: user.login_name
        };

        req.session.save((error) => {
            if (error) {
                console.error('Session save error:', error);
                return res.status(500).json({ message: 'Server error' });
            }
            res.status(200).json({
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name
            });
        });


    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' })
    }
})

//Logout api
router.post('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    })
})

module.exports = router;