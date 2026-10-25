const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

// API 3: Dang ky user moi

router.post("/register", async(req, res) => {
    const {
        login_name,
        password,
        first_name,
        last_name,
        location,
        desscription,
        occupation
    } = req.body

    if (!login_name || !password || !first_name || !last_name) {
        res.status(400).json({
            message: 'Please provide all required fields!'
        })
    }
    try {
        const existingUser = await User.findOne({login_name: login_name})
        if (existingUser) {
            return res.status(400).json({
                message: 'Username already exists!'
            })
        }

        const newUser = new User({
            login_name: login_name,
            password: password,
            first_name: first_name,
            last_name: last_name,
            location: location || ' ',
            description: desscription || ' ',
            occupation: occupation || ' '
        })
        await newUser.save()

        res.status(200).json({
            login_name: newUser.login_name,
            first_name: newUser.first_name,
            last_name: newUser.last_name
        })
    }
    catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({message: 'Server error'})
    }
})

module.exports = router;