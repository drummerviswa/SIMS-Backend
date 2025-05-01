import db from "../../database/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to verify the JWT and attach the user to the request object
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Token is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT verification error:", err.name, err.message);
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
  
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const [adminResult] = await db.query(
      "SELECT * FROM admin WHERE aid = ?",
      [req.params.aid] // Access the logged-in admin's ID
    );
    if (adminResult.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(adminResult[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Update Admin Email
export const updateEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const [result] = await db.query("UPDATE admin SET email = ? WHERE aid = ?", [
      email,
      req.user.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Email updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating email" });
  }
};

// Reset Admin Password
export const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await db.query(
      "UPDATE admin SET password = ? WHERE aid = ?",
      [hashedPassword, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

// Update Profile Picture
export const updateProfilePic = async (req, res) => {
  const { imageUrl } = req.body;
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "admin_profiles",
    });
    const [updateResult] = await db.query(
      "UPDATE admin SET profile_pic = ? WHERE aid = ?",
      [result.secure_url, req.user.id]
    );
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({
      message: "Profile picture updated successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile picture" });
  }
};

import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../../utils/sendEmail.js";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received:", req.body);

  try {
    const [adminResult] = await db.query(
      "SELECT * FROM admin WHERE email = ?",
      [email]
    );

    if (adminResult.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const admin = adminResult[0];

    // Check if the account is verified
    const [verificationResult] = await db.query(
      "SELECT * FROM email_verification WHERE email = ?",
      [email]
    );

    if (verificationResult.length > 0) {
      return res.status(403).json({
        message:
          "Account not verified. Please check your email for the verification link.",
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin.aid }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
    });

    res.status(200).json({
      message: "Login successful",
      token,
      admin: { ...admin, password: undefined },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existingAdmin] = await db.query(
      "SELECT * FROM admin WHERE email = ?",
      [email]
    );

    if (existingAdmin.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Check if the email is already verified
    const [verificationResult] = await db.query(
      "SELECT * FROM email_verification WHERE email = ?",
      [email]
    );
    if (verificationResult.length > 0) {
      return res.status(409).json({
        message:
          "Email already exists. Please verify your email before registering.",
      });
    }

    const verificationCode = uuidv4();
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationCode}`;

    const mailOptions = {
      from: {
        name: "Viswanathan P",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Email Verification for SIMS",
      text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    };

    await sendEmail(mailOptions);

    await db.query(
      "INSERT INTO email_verification (email, verification_code) VALUES (?, ?)",
      [email, verificationCode]
    );

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message:
        "Admin registered successfully. Please check your email for verification.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logout successful" });
};

export const adminverifyEmail = async (req, res) => {
  const { verificationCode } = req.params;

  try {
    const [verificationResult] = await db.query(
      "SELECT * FROM email_verification WHERE verification_code = ?",
      [verificationCode]
    );

    if (verificationResult.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    const email = verificationResult[0].email;
    await db.query(
      "DELETE FROM email_verification WHERE verification_code = ?",
      [verificationCode]
    );

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminresendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const [adminResult] = await db.query(
      "SELECT * FROM admin WHERE email = ?",
      [email]
    );

    if (adminResult.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const verificationCode = uuidv4();
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationCode}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    };

    await sendEmail(mailOptions);

    // Check if a verification record exists
    const [existingVerification] = await db.query(
      "SELECT * FROM email_verification WHERE email = ?",
      [email]
    );

    if (existingVerification.length > 0) {
      await db.query(
        "UPDATE email_verification SET verification_code = ? WHERE email = ?",
        [verificationCode, email]
      );
    } else {
      await db.query(
        "INSERT INTO email_verification (email, verification_code) VALUES (?, ?)",
        [email, verificationCode]
      );
    }

    res
      .status(200)
      .json({ message: "Verification email resent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateName = async (req, res) => {
  const { name } = req.body;

  try {
    const [result] = await db.query("UPDATE admin SET name = ? WHERE aid = ?", [
      name,
      req.user.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Name updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating name" });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const [adminResult] = await db.query("SELECT * FROM admin WHERE email = ?", [
      req.body.email,
    ]);    
    if (adminResult.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = adminResult[0];
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE admin SET password = ? WHERE aid = ?", [
      hashed,
      req.user.id,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password" });
  }
};
