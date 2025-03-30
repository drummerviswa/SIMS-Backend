import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";

//Importing middlewares
import cloudinary from "./middlewares/cloudinary.js";
import adminRouter from "./routes/admin/admin.routes.js";
import departmentRouter from "./routes/department/dept.routes.js";
import facultyRouter from "./routes/faculty/faculty.routes.js";

//Express app creation
const app = express();

//Middlewares
app.use(express.urlencoded({ extended: false }));
dotenv.config();
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(express.json());

//Base URL
app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: path.join(process.cwd(), "src", "views"),
  });
});

//Routes

//Admin routes
app.use("/admin", adminRouter);
//Department routes
app.use("/department", departmentRouter);
//Faculty routes
app.use("/faculty", facultyRouter);

//Cloudinary setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Define a POST route for uploading an image
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  console.log("Uploaded file:", req.file);
  cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to upload image to Cloudinary", details: err });
    }

    console.log("Cloudinary upload result:", result);
    res.json({ imageUrl: result.secure_url });
  });
});

//Check DB Connection
import { connectionCheck } from "./database/db.js";

connectionCheck()
  .then((result) => {
    console.log("Database connection successful:", result);
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

//App listener
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Api started 🤍 at ${process.env.BASE_URL + ":" + port}`);
});
