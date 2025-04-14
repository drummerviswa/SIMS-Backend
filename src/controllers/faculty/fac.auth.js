import db from "../../database/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export const facultyLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [facResult] = await db.query(
      "SELECT * FROM faculty WHERE username = ?",
      [username]
    );

    if (facResult.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // const isMatch = await bcrypt.compare(password, admin.password);
    const isMatch = facResult[0].password === password;
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: facResult[0].facid }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      faculty: { ...facResult[0], password: undefined },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const facultyRegister = (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM faculty WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      if (results.length > 0) {
        return res.status(409).json({ message: "Username already exists" });
      }
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        db.query(
          "INSERT INTO faculty (username, password) VALUES (?, ?)",
          [username, hash],
          (err, results) => {
            if (err) {
              return res.status(500).json({ message: "Internal server error" });
            }
            res.status(201).json({
              message: "Registration successful",
              userId: results.insertId,
            });
          }
        );
      });
    }
  );
};

export const facultyLogout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};
