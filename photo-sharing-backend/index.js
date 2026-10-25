const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AuthRouter = require("./routes/AuthRouter");
const RegisterRouter = require("./routes/RegisterRouter");
const CommentRouter = require("./routes/CommentRouter");
const requireLogin = require("./middleware/requireLogin");

dbConnect();

// 1) tin proxy (quan trọng trên CodeSandbox / deploy)
app.set("trust proxy", 1);

// 2) CORS: phản chiếu origin + cho phép credentials + xử lý preflight
app.use(
  cors({
    origin: (origin, cb) => {
      // cho phép cả trường hợp request không có Origin (Postman/server-to-server)
      cb(null, origin || true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// 3) Session cookie: cross-site => SameSite=None + Secure=true (HTTPS)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "tungdc",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none", // ✅ để cookie gửi qua XHR khác domain
      secure: true,     // ✅ bắt buộc khi sameSite none (vì csb là https)
    },
  })
);

app.use(express.json());

// 4) Serve ảnh tĩnh (nên dùng path.resolve cho chắc)
app.use("/images", express.static(path.resolve(__dirname, "public", "images")));

app.use("/admin", AuthRouter);
app.use("/api", RegisterRouter);
app.use("/api/commentsOfPhoto", requireLogin, CommentRouter);
app.use("/api/user", requireLogin, UserRouter);
app.use("/api/photo", requireLogin, PhotoRouter);

app.get("/", (req, res) => {
  res.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
