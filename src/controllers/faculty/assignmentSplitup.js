import db from "../../database/db.js";

export const getAssignmentSplitup = async (req, res) => {
  try {
    const { faculty, subject } = req.params;
    const query = `SELECT a.*, c.criteriaName FROM assignmentsplitup AS a JOIN criteria AS c ON a.criteria = c.cid WHERE faculty = ? AND subject = ?`;
    const [rows] = await db.query(query, [faculty, subject]);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error fetching assignment splitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addAssignmentSplitup = async (req, res) => {
  try {
    const { faculty, subject, criteria, mainWeightage, tenure } = req.body;
    const query = `INSERT INTO assignmentsplitup (faculty, subject, criteria, mainWeightage, tenure) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.query(query, [
      faculty,
      subject,
      criteria,
      mainWeightage,
      tenure,
    ]);
    res.status(201).json({
      message: "Assignment splitup added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error adding assignment splitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAssignmentSplitup = async (req, res) => {
  try {
    const { id } = req.params;
    const { criteria, mainWeightage, tenure } = req.body;
    const query = `UPDATE assignmentsplitup SET criteria = ?, mainWeightage = ?, tenure = ? WHERE asid = ?`;
    const [result] = await db.query(query, [
      criteria,
      mainWeightage,
      tenure,
      id,
    ]);
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Assignment splitup updated successfully" });
    } else {
      res.status(404).json({ message: "No data found to update" });
    }
  } catch (error) {
    console.error("Error updating assignment splitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAssignmentSplitup = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM assignmentsplitup WHERE asid = ?`;
    const [result] = await db.query(query, [id]);
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Assignment splitup deleted successfully" });
    } else {
      res.status(404).json({ message: "No data found to delete" });
    }
  } catch (error) {
    console.error("Error deleting assignment splitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
