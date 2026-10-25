const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();

// lấy danh sách user cho sidebar 
router.get("/list", async (request, response) => {
    try {
        // lấy các fields cần thiết cho sidebar
        const users = await User.find({}, "_id first_name last_name").exec();

        // Thêm số ảnh cho mỗi user
        const usersWithPhotoCount = await Promise.all(
            users.map(async (user) => {
                const photoCount = await Photo.countDocuments({ user_id: user._id });
                return {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    photo_count: photoCount
                };
            })
        );

        response.status(200).json(usersWithPhotoCount);
    } catch (error) {
        console.error("Error fetching user list:", error);
        response.status(500).json({ error: "Internal server error" });
    }
});

//lấy thông tin chi tiết của user
router.get("/:id", async (request, response) => {
    const userId = request.params.id;

    try {
        // lấy thông tin user cho detailed view
        const user = await User.findById(userId, "_id first_name last_name location description occupation").exec();

        if (!user) {
            return response.status(400).json({ error: "User not found" });
        }

        //lấy số lượng photo của user
        const photoCount = await Photo.countDocuments({ user_id: userId });
        const userWithPhotoCount = {
            ...user.toObject(),
            photo_count: photoCount
        };

        response.status(200).json(userWithPhotoCount);
    } catch (error) {
        console.error("Error fetching user:", error);
        response.status(400).json({ error: "Invalid user ID" });
    }
});

// cập nhật thông tin user
router.put("/:id", async (req, res) => {
    if (!req.session?.user) {
        return res.status(401).json({ message: 'Authorization required' });
    }

    if (req.params.id !== req.session.user._id) {
        return res.status(403).json({ message: 'You can only edit your own profile' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.first_name) user.first_name = req.body.first_name.trim();
        if (req.body.last_name) user.last_name = req.body.last_name.trim();
        if (req.body.location !== undefined) user.location = req.body.location.trim();
        if (req.body.description !== undefined) user.description = req.body.description.trim();
        if (req.body.occupation !== undefined) user.occupation = req.body.occupation.trim();

        await user.save();
        return res.status(200).json({ message: 'Profile updated', user });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;