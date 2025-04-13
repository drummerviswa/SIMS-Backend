import db from "../../database/db.js";

export const getMainSplitup = async (req, res) => {
  try {
    const { faculty, subject } = req.params;
    const query = `SELECT m.*,c.criteriaName FROM mainsplitup AS m JOIN criteria AS c ON m.criteria=c.cid WHERE faculty = ? AND subject = ?`;
    const [rows] = await db.query(query, [faculty, subject]);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error fetching main splitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addMainSplitup = async (req, res) => {
  try {
    const { faculty, subject, criteria, mainWeightage, tenure } = req.body;
    const query = `INSERT INTO mainsplitup (faculty, subject, criteria, mainWeightage,tenure) VALUES (?, ?, ?,?,?)`;
    const [result] = await db.query(query, [
      faculty,
      subject,
      criteria,
      mainWeightage,
      tenure,
    ]);
    res.status(201).json({
      message: "Main splitup added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error adding main splitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMainSplitup = async (req, res) => {
  try {
    const { id } = req.params;
    const { criteria, mainWeightage,tenure } = req.body;
    const query = `UPDATE mainsplitup SET criteria = ?, mainWeightage = ?, tenure =? WHERE msid=?`;
    const [result] = await db.query(query, [
      criteria,
      mainWeightage,
      tenure,
      id,
    ]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Main splitup updated successfully" });
    } else {
      res.status(404).json({ message: "No data found to update" });
    }
  } catch (error) {
    console.error("Error updating main splitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteMainSplitup = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM mainsplitup WHERE msid=?`;
    const [result] = await db.query(query, [id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Main splitup deleted successfully" });
    } else {
      res.status(404).json({ message: "No data found to delete" });
    }
  } catch (error) {
    console.error("Error deleting main splitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllMainSplitup = async (req, res) => {
  try {
    const query = `SELECT * FROM mainsplitup`;
    const [rows] = await db.query(query);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error fetching all main splitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMainSplitupById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM mainsplitup WHERE msid = ?`;
    const [rows] = await db.query(query, [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error fetching main splitup by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
