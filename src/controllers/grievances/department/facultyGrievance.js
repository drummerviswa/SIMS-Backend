import db from "../../../database/db.js";

export const getFacultyGrievances = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT g.*, d.deptName, f.facName FROM grievance AS g JOIN faculty AS f ON g.faculty = f.facid JOIN department AS d ON f.primaryDept=d.deptid WHERE f.primaryDept=? AND reciever = 'department'",
      [departmentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No grievances found" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching grievances:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFacultyGrievanceById = async (req, res) => {
  const { grievanceId } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM grievance WHERE gid = ?", [
      grievanceId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching grievance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFacultyGrievance = async (req, res) => {
  const { grievanceId } = req.params;
  const { gMessage } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE grievance SET gMessage = ? WHERE gid = ?",
      [gMessage, grievanceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    return res.status(200).json({ message: "Grievance updated successfully" });
  } catch (error) {
    console.error("Error updating grievance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFacultyGrievance = async (req, res) => {
  const { grievanceId } = req.params;

  try {
    const [result] = await db.query("DELETE FROM grievance WHERE gid = ?", [
      grievanceId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    return res.status(200).json({ message: "Grievance deleted successfully" });
  } catch (error) {
    console.error("Error deleting grievance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const createFacultyGrievance = async (req, res) => {
  const { faculty, department, gMessage } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO grievance (department,sender,reciever, gMessage) VALUES (?, ?, ?, ?)",
      [department, faculty, "faculty", "department", gMessage]
    );

    return res.status(201).json({
      message: "Grievance created successfully",
      grievanceId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating grievance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
