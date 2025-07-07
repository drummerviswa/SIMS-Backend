import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import multer from "multer";
import bodyParser from "body-parser";

// Custom utilities/middleware
import { runBackup } from "./utils/backup.js";
import { upload } from "./utils/imageUpload.js";
import cloudinary from "./middlewares/cloudinary.js";
import { connectionCheck } from "./database/db.js";

// Routers
import adminRouter from "./routes/admin/admin.routes.js";
import departmentRouter from "./routes/department/dept.routes.js";
import facultyRouter from "./routes/faculty/faculty.routes.js";
import reportRouter from "./routes/report.routes.js";


dotenv.config();
const app = express();

//  MIDDLEWARES
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }));
app.use(express.json());

//  ROOT ROUTE
app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: path.join(process.cwd(), "src", "views"),
  });
});

//  IMAGE UPLOAD ROUTE
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to upload image to Cloudinary",
        details: err,
      });
    }

    res.json({ imageUrl: result.secure_url });
  });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//  DATABASE BACKUP ROUTE
app.get("/backup", async (req, res) => {
  try {
    const { zipFile } = await runBackup();

    if (!fs.existsSync(zipFile)) {
      return res.status(404).send("Backup file not found");
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(zipFile)}"`
    );

    const stream = fs.createReadStream(zipFile);
    stream.pipe(res);

    stream.on("error", (err) => {
      console.error("File Stream Error:", err);
      res.status(500).end();
    });
  } catch (err) {
    console.error("Backup error:", err);
    res.status(500).json({ error: "Backup failed", details: err.message });
  }
});

// ROUTES
app.use("/admin", adminRouter);
app.use("/department", departmentRouter);
app.use("/faculty", facultyRouter);
app.use("/reports", reportRouter);

// DB CONNECTION
connectionCheck()
  .then((result) => {
    console.log("Database connection successful:", result);
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// SERVER LISTENER
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API started 🤍 at ${process.env.BASE_URL}:${port}`);
});
