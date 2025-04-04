import db from "../../database/db.js";

//	bid	branchName	subjects
//branch - table

export const getAllBranches = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT b.*,d.degName FROM branch AS b JOIN degree AS d ON b.degree = d.degid"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBranchById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT b.*,d.degName FROM branch AS b JOIN degree AS d ON b.degree = d.degid WHERE bid = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createBranch = async (req, res) => {
  const { branchName, degree, subjects } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO branch (branchName,degree, subjects) VALUES (?, ?,?)",
      [branchName, degree, subjects]
    );
    res.status(201).json({
      message: "Branch created successfully",
      branchId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBranch = async (req, res) => {
  const { id } = req.params;
  const { branchName, subjects } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE branch SET branchName = ?, subjects = ? WHERE bid = ?",
      [branchName, subjects, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json({ message: "Branch updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBranch = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM branch WHERE bid = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBranchByDepartment = async (req, res) => {
  const { department } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM branch WHERE department = ?", [
      department,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBranchByDegree = async (req, res) => {
  const { degree } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM branch WHERE degree = ?", [
      degree,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBranchByDuration = async (req, res) => {
  const { duration } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM branch WHERE duration = ?", [
      duration,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBranchByGraduation = async (req, res) => {
  const { graduation } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM branch WHERE graduation = ?", [
      graduation,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
