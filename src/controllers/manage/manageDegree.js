//`degid	degName	department	branch	duration	graduation
import db from "../../database/db.js";

export const getAllDegrees = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT d.*,dep.* FROM degree AS d JOIN department AS dep ON d.department = dep.deptid"
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDegreeById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT d.*,dep.* FROM degree AS d JOIN department AS dep ON d.department = dep.deptid WHERE d.degid = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Degree not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addDegree = async (req, res) => {
  const { degName, department, branch, duration, graduation } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO degree (degName, department, duration, graduation) VALUES ( ?, ?, ?, ?)",
      [degName, department, duration, graduation]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateDegree = async (req, res) => {
  const { id } = req.params;
  const { degName, department, duration, graduation } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE degree SET degName = ?, department = ?,  duration = ?, graduation = ? WHERE degid = ?",
      [degName, department, duration, graduation, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Degree not found" });
    }
    res.status(200).json({ message: "Degree updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteDegree = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM degree WHERE degid = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Degree not found" });
    }
    res.status(200).json({ message: "Degree deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDegreeByDepartment = async (req, res) => {
  const { department } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM degree WHERE department = ?", [
      department,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDegreeByDuration = async (req, res) => {
  const { duration } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM degree WHERE duration = ?", [
      duration,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
