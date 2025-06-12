// src/routes/admin/admin.routes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import adminManage from "../manage/manage.admin.routes.js";
import adminAuth from "./admin.auth.js";
import adminGrievance from "../grievances/grievance.admin.routes.js";
import academicPeriodRouter from "./academics.js";

const adminRouter = express.Router();

const uploadDir = path.join("uploads", "academic");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext).replace(/[\s_]+/g, "-").toLowerCase();
    cb(null, `${timestamp}_${cleanName}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    cb(allowedTypes.includes(file.mimetype) ? null : new Error("Invalid file type"), allowedTypes.includes(file.mimetype));
  },
});

// Upload academic file
adminRouter.post("/upload-academic-file", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { filename } = req.file;
  const url = `${process.env.BASE_URL}:${process.env.PORT}/uploads/academic/${filename}`;
  const uploadedAt = new Date().toISOString();

  res.json({ name: filename, url, uploadedAt });
});

// List academic files
adminRouter.get("/academic-files", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Failed to read directory" });

    const fileList = files.map((file) => {
      const fullPath = path.join(uploadDir, file);
      const stats = fs.statSync(fullPath);
      return {
        name: file,
        url: `${process.env.BASE_URL}:${process.env.PORT}/uploads/academic/${file}`,
        uploadedAt: stats.birthtime.toISOString(), // Or `mtime` for last modified
      };
    });

    // Most recent first
    fileList.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.json({ files: fileList });
  });
});

// Delete academic file
adminRouter.delete("/academic-files/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Delete file error:", err);
      return res.status(500).json({ error: "Failed to delete file" });
    }
    res.json({ message: "File deleted", filename });
  });
});

// Other admin routes
adminRouter.use("/auth", adminAuth);
adminRouter.use("/manage", adminManage);
adminRouter.use("/grievance", adminGrievance);
adminRouter.use("/academicPeriod", academicPeriodRouter);

export default adminRouter;
