import db from "../../database/db.js";

export const viewBatchByFaculty = async (req, res) => {
  const { facId } = req.params;
  try {
    const sql = `SELECT b.batch_id, b.batch_name, b.start_date, b.end_date, s.subject_name FROM batch b JOIN subject s ON b.subject_id = s.subject_id WHERE b.faculty_id = ?`;
    const [rows] = await db.query(sql, [facId]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No batches found for this faculty." });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
