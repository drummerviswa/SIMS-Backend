import db from "../../../database/db.js";

export const getFacultyGrievances = async (req, res) => {
  try {
    const sql = `SELECT g.*,f.facName,d.deptName FROM grievance AS g JOIN faculty AS f ON g.faculty=f.facid JOIN department AS d ON f.primaryDept=d.deptid WHERE reciever=? AND sender=?`;
    const [grievance] = await db.query(sql, ["admin", "faculty"]);
    if (grievance.length === 0) {
      return res.status(404).json({ message: "No grievances found" });
    }
    res.status(200).json(grievance);
  } catch (err) {
    console.error("Error fetching grievances:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
