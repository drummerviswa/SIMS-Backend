import express from "express";
import {
  facultyLogin,
  facultyLogout,
  getFacultyProfile,
} from "../../controllers/faculty/fac.auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Faculty Authentication Route");
});
router.post("/login", facultyLogin);
router.post("/logout", facultyLogout);
router.get("/profile/:facid", getFacultyProfile);

export default router;
