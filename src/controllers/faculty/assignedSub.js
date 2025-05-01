import db from "../../database/db.js";

export const getAssignedSub = async (req, res) => {
  const { facid } = req.params;

  try {
    const query = `
        SELECT sba.*, s.*, f.*, d.*, b.*, deg.*, ac.*,ba.* FROM subassign AS sba 
        LEFT JOIN subjects AS s ON sba.subject = s.subid 
        LEFT JOIN faculty AS f ON sba.faculty = f.facid 
        LEFT JOIN department AS d ON f.primaryDept = d.deptid 
        LEFT JOIN branch AS b ON b.bid = sba.branch 
        LEFT JOIN degree AS deg ON deg.degid = b.degree 
        LEFT JOIN batch AS ba ON sba.batch = ba.batchid
        LEFT JOIN assesscomp AS ac ON ac.acid = s.component
        WHERE sba.faculty = ?
        `;

    const [rows] = await db.query(query, [facid]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No subjects found for this faculty." });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching assigned subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAssignedSubById = async (req, res) => {
  const { subid } = req.params;

  try {
    const query = `
            SELECT sba.*, s.*, f.*, d.*, b.*, deg.*, ac.*, ba.*, r.* FROM subassign AS sba 
            LEFT JOIN subjects AS s ON sba.subject = s.subid 
            LEFT JOIN faculty AS f ON sba.faculty = f.facid 
            LEFT JOIN department AS d ON f.primaryDept = d.deptid 
            LEFT JOIN branch AS b ON b.bid = sba.branch 
            LEFT JOIN degree AS deg ON deg.degid = b.degree 
            LEFT JOIN batch AS ba ON sba.batch = ba.batchid
            LEFT JOIN assesscomp AS ac ON ac.acid = s.component
            LEFT JOIN regulations AS r ON r.rid = ac.regulation
            WHERE s.subid = ?
            `;

    const [rows] = await db.query(query, [subid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Subject not found." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching assigned subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
