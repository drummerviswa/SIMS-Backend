import db from "../../database/db.js";

// GET all subsplitups for a specific assignment split
export const getAssignmentSubsplitup = async (req, res) => {
  try {
    const { faculty, subject, asid } = req.params;
    const query = `SELECT * FROM assignmentsubsplitup WHERE faculty = ? AND subject = ? AND mainsplitup = ?`;
    const [rows] = await db.execute(query, [faculty, subject, asid]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching assignment subsplitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST new subsplitup
export const addAssignmentSubsplitup = async (req, res) => {
  try {
    const { faculty, subject, mainsplitup, subCriteria, subWeightage } =
      req.body;
    console.log("Received data:", req.body);
    const query = `
      INSERT INTO assignmentsubsplitup (faculty, subject, mainsplitup, subCriteria, subWeightage)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      faculty,
      subject,
      mainsplitup,
      subCriteria,
      subWeightage,
    ]);
    res
      .status(201)
      .json({ message: "Assignment subsplitup added", data: result });
  } catch (error) {
    console.error("Error adding assignment subsplitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT update assignment subsplitup
export const updateAssignmentSubsplitup = async (req, res) => {
  try {
    const { id } = req.params;
    const { faculty, subject, mainsplitup, subCriteria, subWeightage } =
      req.body;
    const query = `
      UPDATE assignmentsubsplitup
      SET faculty = ?, subject = ?, mainsplitup = ?, subCriteria = ?, subWeightage = ?
      WHERE assignsubid = ?
    `;
    const [result] = await db.execute(query, [
      faculty,
      subject,
      mainsplitup,
      subCriteria,
      subWeightage,
      id,
    ]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Assignment subsplitup updated" });
    } else {
      res.status(404).json({ message: "Assignment subsplitup not found" });
    }
  } catch (error) {
    console.error("Error updating assignment subsplitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE assignment subsplitup
export const deleteAssignmentSubsplitup = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM assignmentsubsplitup WHERE assignsubid = ?`;
    const [result] = await db.execute(query, [id]);
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Assignment subsplitup deleted successfully" });
    } else {
      res.status(404).json({ message: "Assignment subsplitup not found" });
    }
  } catch (error) {
    console.error("Error deleting assignment subsplitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubSplitAssignByTenure = async (req, res) => {
  try {
    const { faculty, subject, tenure } = req.params;
    const query = `
      SELECT
      m.*,
      c.*,
      ac.*,
      COALESCE(
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'subsplitid', s.assignsubid,
                  'subCriteria', s.subCriteria,
                  'subWeightage', s.subWeightage
              )
          ),
          JSON_ARRAY()
      ) AS subsplitups
      FROM
          assignmentsplitup AS m
      LEFT JOIN assignmentsubsplitup AS s ON s.mainsplitup = m.asid
      JOIN criteria AS c ON m.criteria = c.cid
      JOIN subjects AS sub ON m.subject = sub.subid
      JOIN assesscomp AS ac ON ac.acid = sub.component
      WHERE
          m.faculty = ? AND m.subject = ? AND m.tenure = ?
      GROUP BY
          m.asid, ac.acid;
    `;
    const [rows] = await db.execute(query, [faculty, subject, tenure]);
    console.log("Fetched subsplitup by tenure:", rows);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching subsplitup by tenure:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
