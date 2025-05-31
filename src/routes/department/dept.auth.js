import express from "express";
import {
  deptLogin,
  deptRegister,
  deptLogout,
  getDepartmentProfile,
} from "../../controllers/department/dept.auth.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Department Auth Route");
});
router.post("/login", deptLogin);
router.post("/register", deptRegister);
router.post("/logout", deptLogout);
router.get("/profile/:deptid", getDepartmentProfile);

export default router;
