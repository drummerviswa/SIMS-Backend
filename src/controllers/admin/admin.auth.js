import db from "../../database/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../../utils/sendEmail.js";

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

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
    });

    res
      .status(200)
      .json({
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
