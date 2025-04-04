import db from "../../database/db.js";

//	facid	facName	username	password	primaryDept	designation

export const getAllFaculty = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT f.*,d.deptName FROM faculty AS f JOIN department AS d ON f.primaryDept = d.deptid"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFacultyById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT f.*,d.deptName FROM faculty AS f JOIN department AS d ON f.primaryDept = d.deptid WHERE f.facid = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createFaculty = async (req, res) => {
  const { facName, username, password, primaryDept, designation } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO faculty (facName, username, password, primaryDept, designation) VALUES (?, ?, ?, ?, ?)",
      [facName, username, password, primaryDept, designation]
    );
    res.status(201).json({
      message: "Faculty created successfully",
      facultyId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFaculty = async (req, res) => {
  const { id } = req.params;
  const { facName, username, password, primaryDept, designation } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE faculty SET facName = ?, username = ?, password = ?, primaryDept = ?, designation = ? WHERE facid = ?",
      [facName, username, password, primaryDept, designation, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json({ message: "Faculty updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFaculty = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM faculty WHERE facid = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
