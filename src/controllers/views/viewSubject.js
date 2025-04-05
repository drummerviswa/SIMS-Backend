import db from "../../database/db.js";

export const viewSubjectByFaculty = async (req, res) => {
  const { facId } = req.params;
  try {
    const sql = `SELECT s.* FROM subjects AS s JOIN subassign AS sba ON sba.subject=s.subid WHERE sba.faculty = ?`;
    const [rows] = await db.query(sql, [facId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
