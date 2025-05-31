import express from "express";
import {
  adminLogin,
  adminLogout,
  adminRegister,
  adminresendVerificationEmail,
  adminverifyEmail,
  changePassword,
  getAdminProfile,
  resetPassword,
  updateEmail,
  updateName,
  updateProfilePic,
  verifyToken,
} from "../../controllers/admin/admin.auth.js";
import { upload } from "../../utils/imageUpload.js";

const router = express.Router();

router.get("/", (req, res) => res.send("Admin Auth Route"));
router.post("/register", adminRegister);
router.post("/verify-email/:verificationCode", adminverifyEmail);
router.post("/resend-verification-email", adminresendVerificationEmail);
router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/profile", verifyToken, getAdminProfile);

router.get("/profile/:aid", verifyToken, getAdminProfile);
router.put("/update-name", verifyToken, updateName);
router.put("/update-email", verifyToken, updateEmail);
router.put(
  "/update-profile-pic",
  verifyToken,
  upload.single("imageUrl"),
  updateProfilePic
);
router.put("/reset-password", verifyToken, resetPassword);
router.put("/change-password", verifyToken, changePassword);

export default router;
