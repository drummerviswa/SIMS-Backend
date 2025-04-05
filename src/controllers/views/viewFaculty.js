import db from "../../database/db.js";

export const viewFaculty = async (req, res) => {
  const { departmentId } = req.params;
  const sql = `SELECT f.*,d.deptName FROM faculty AS f JOIN department AS d ON f.primaryDept = d.deptid
                 WHERE d.deptid = ?`;
  try {
    const [rows] = await db.query(sql, [departmentId]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No faculty found for this department" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
