const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const Comment = require("../db/commentModel");
const requiredLogin = require("../middleware/requireLogin");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();

//Config multer de upload anh
const imagesDir = path.join(
  __dirname,
  "../../../photo-sharing/photo-sharing-v1/public/images"
);

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${
      req.session.user.login_name
    }_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

//api upload anh

router.post("/new", requiredLogin, upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const newPhoto = new Photo({
      file_name: req.file.filename,
      user_id: req.session.user._id,
      date_time: new Date(),
    });
    await newPhoto.save();
    res.status(200).json({ message: "Photo uploaded" });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Error uploading photo" });
  }
});

// api lấy tất cả photos của user kèm comment
router.get("/photosOfUser/:id", async (request, response) => {
  const userId = request.params.id;

  try {
    // kiểm tra user có tồn tại không
    const userExists = await User.findById(userId).exec();
    if (!userExists) {
      return response.status(400).json({ error: "User not found" });
    }

    // lấy tất cả photos của user
    const photos = await Photo.find({ user_id: userId }).exec();

    // lấy thông tin comments từ bảng comment
    const photosWithDetails = await Promise.all(
      photos.map(async (photo) => {
        // lấy tất cả comments của photo
        const comments = await Comment.find({ photo_id: photo._id })
          .populate("user_id", "_id first_name last_name")
          .sort({ date_time: -1 })
          .exec();

        // format comments cho frontend
        const formattedComments = comments.map((comment) => ({
          _id: comment._id,
          comment: comment.comment,
          date_time: comment.date_time,
          user: comment.user_id
            ? {
                _id: comment.user_id._id,
                first_name: comment.user_id.first_name,
                last_name: comment.user_id.last_name,
              }
            : null,
        }));

        return {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          comments: formattedComments,
        };
      })
    );

    response.status(200).json(photosWithDetails);
  } catch (error) {
    console.error("Error fetching photos:", error);
    response.status(400).json({ error: "Invalid user ID" });
  }
});

module.exports = router;
