import db from "../../../database/db.js";

export const getDepartmentGrievances = async (req, res) => {
  try {
    const sql = `SELECT g.*,d.deptName FROM grievance AS g JOIN department AS d ON g.department=d.deptid WHERE reciever=? AND sender=?`;
    const [grievance] = await db.query(sql, ["admin", "department"]);
    if (grievance.length === 0) {
      return res.status(404).json({ message: "No grievances found" });
    }
    res.status(200).json(grievance);
  } catch (err) {
    console.error("Error fetching grievances:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDepartmentGrievanceById = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `SELECT g.*,d.deptName FROM grievance AS g JOIN department AS d ON g.department=d.deptid WHERE gid=?`;
    const [grievance] = await db.query(sql, [id]);
    if (grievance.length === 0) {
      return res.status(404).json({ message: "Grievance not found" });
    }
    res.status(200).json(grievance[0]);
  } catch (err) {
    console.error("Error fetching grievance by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createDepartmentGrievance = async (req, res) => {
  const { sender, reciever, faculty, department, gMessage } = req.body;
  try {
    if (!faculty && department) {
      const sql = `INSERT INTO grievance ( department, sender, reciever, gmessage) VALUES (?, ?, ?, ?)`;
      await db.query(sql, [department, sender, reciever, gMessage]);
      res.status(201).json({ message: "Grievance created successfully" });
    }
    if (faculty && !department) {
      const sql = `INSERT INTO grievance (faculty,  sender, reciever, gmessage) VALUES ( ?, ?, ?, ?)`;
      await db.query(sql, [faculty, sender, reciever, gMessage]);
      res.status(201).json({ message: "Grievance created successfully" });
    }
  } catch (err) {
    console.error("Error creating grievance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDepartmentGrievance = async (req, res) => {
  const { faculty, department, sender, reciever, message } = req.body;
  const { id } = req.params;
  try {
    const sql = `UPDATE grievance SET faculty=?, department=?, sender=?, reciever=?, gmessage=? WHERE gid=?`;
    await db.query(sql, [faculty, department, sender, reciever, message, id]);
    res.status(200).json({ message: "Grievance updated successfully" });
  } catch (err) {
    console.error("Error updating grievance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteDepartmentGrievance = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `DELETE FROM grievance WHERE gid=?`;
    await db.query(sql, [id]);
    res.status(200).json({ message: "Grievance deleted successfully" });
  } catch (err) {
    console.error("Error deleting grievance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
