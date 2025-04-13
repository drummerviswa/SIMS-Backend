import db from "../../database/db.js";

export const viewBatchByFaculty = async (req, res) => {
  const { facId } = req.params;
  try {
    const sql = `SELECT b.*,r.regName FROM batch AS b JOIN regulations AS r ON r.rid = b.regulation JOIN subassign AS sba ON b.batchid = sba.batch WHERE sba.faculty = ?`;
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
