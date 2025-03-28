import express from "express";
import {
  adminLogin,
  adminLogout,
  adminRegister,
  adminresendVerificationEmail,
  adminverifyEmail,
} from "../../controllers/admin/admin.auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Admin Authentication Route");
});
router.post("/login", adminLogin);
router.post("/register", adminRegister);
router.post("/logout", adminLogout);
router.post("/verify-email/:verificationCode", adminverifyEmail);
router.post("/resend-verification-email", adminresendVerificationEmail);

export default router;
