import db from "../../database/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";


export const deptLogin = (req, res) => {
    const {username, password} = req.body;
    db.query("SELECT * FROM department WHERE username = ?", [username], (err, results) => {
        if (err) {
            return res.status(500).json({message: "Internal server error"});
        }
        if (results.length === 0) {
            return res.status(401).json({message: "Invalid credentials"});
        }
        const department = results[0];
        bcrypt.compare(password, department.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({message: "Internal server error"});
            }
            if (!isMatch) {
                return res.status(401).json({message: "Invalid credentials"});
            }
            const token = jwt.sign({id: department.id}, process.env.JWT_SECRET, {expiresIn: "1h"});
            res.cookie("token", token, {httpOnly: true});
            res.status(200).json({message: "Login successful", token});
        });
    });
}

export const deptRegister = (req, res) => {
    const {username, password} = req.body;
    db.query("SELECT * FROM department WHERE username = ?", [username], (err, results) => {
        if (err) {
            return res.status(500).json({message: "Internal server error"});
        }
        if (results.length > 0) {
            return res.status(409).json({message: "Username already exists"});
        }
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({message: "Internal server error"});
            }
            db.query("INSERT INTO department (username, password) VALUES (?, ?)", [username, hash], (err, results) => {
                if (err) {
                    return res.status(500).json({message: "Internal server error"});
                }
                res.status(201).json({message: "Registration successful", userId: results.insertId});
            });
        });
    });
}

export const deptLogout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({message: "Logout successful"});
}