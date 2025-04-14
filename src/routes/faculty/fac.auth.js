import express from "express";
import {
  facultyLogin,
  facultyLogout,
} from "../../controllers/faculty/fac.auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Faculty Authentication Route");
});
router.post("/login", facultyLogin);
router.post("/logout", facultyLogout);

export default router;
