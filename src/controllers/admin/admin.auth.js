import db from "../../database/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../../utils/sendEmail.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [admin] = await db.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Check if the account is verified
    const [verification] = await db.query(
      "SELECT * FROM email_verification WHERE email = ?",
      [email]
    );
    if (verification) {
        return res.status(403).json({
            message: "Account not verified. Please check your email for verification link.",
        });
    }
    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful", token });
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
    if (existingAdmin) {
      return res.status(409).json({ message: "Email already exists" });
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
    const [verificationResult] = await db.query(
      "INSERT INTO email_verification (email, verification_code) VALUES (?, ?)",
      [email, verificationCode]
    );
    if (!verificationResult.affectedRows) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminLogout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

export const adminverifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  try {
    const [verification] = await db.query(
      "SELECT * FROM email_verification WHERE verification_code = ?",
      [verificationCode]
    );
    if (!verification) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    await db.query("DELETE FROM email_verification WHERE id = ?", [
      verification.id,
    ]);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const adminresendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const [admin] = await db.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);
    if (!admin) {
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
    await db.query(
      "UPDATE email_verification SET verification_code = ? WHERE email = ?",
      [verificationCode, email]
    );
    res.status(200).json({ message: "Verification email resent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

