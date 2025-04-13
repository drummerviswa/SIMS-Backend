import db from "../../database/db.js";
//subsplitid	faculty	subject	mainsplitup	subCriteria	subWeightage

export const getSubSplitup = async (req, res) => {
  try {
    const { faculty, subject, msid } = req.params;
    const query = `SELECT * FROM subsplitup WHERE faculty = ? AND subject = ? AND mainsplitup = ?`;
    const [rows] = await db.execute(query, [faculty, subject, msid]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching subsplitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addSubSplitup = async (req, res) => {
  try {
    const { faculty, subject, mainsplitup, subCriteria, subWeightage } =
      req.body;
    const query = `INSERT INTO subsplitup (faculty, subject, mainsplitup, subCriteria, subWeightage) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute(query, [
      faculty,
      subject,
      mainsplitup,
      subCriteria,
      subWeightage,
    ]);
    res
      .status(201)
      .json({ message: "Subsplitup added successfully", id: result.insertId });
  } catch (error) {
    console.error("Error adding subsplitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubSplitup = async (req, res) => {
  try {
    const { id } = req.params;
    const { faculty, subject, mainsplitup, subCriteria, subWeightage } =
      req.body;
    const query = `UPDATE subsplitup SET faculty = ?, subject = ?, mainsplitup = ?, subCriteria = ?, subWeightage = ? WHERE subsplitid = ?`;
    const [result] = await db.execute(query, [
      faculty,
      subject,
      mainsplitup,
      subCriteria,
      subWeightage,
      id,
    ]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Subsplitup updated successfully" });
    } else {
      res.status(404).json({ message: "Subsplitup not found" });
    }
  } catch (error) {
    console.error("Error updating subsplitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubSplitup = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM subsplitup WHERE subsplitid = ?`;
    const [result] = await db.execute(query, [id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Subsplitup deleted successfully" });
    } else {
      res.status(404).json({ message: "Subsplitup not found" });
    }
  } catch (error) {
    console.error("Error deleting subsplitup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubSplitupByTenure = async (req, res) => {
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
                  'subsplitid', s.subsplitid,
                  'subCriteria', s.subCriteria,
                  'subWeightage', s.subWeightage
              )
          ),
          JSON_ARRAY()
      ) AS subsplitups
      FROM
          mainsplitup AS m
      LEFT JOIN subsplitup AS s ON s.mainsplitup = m.msid
      JOIN criteria AS c ON m.criteria = c.cid
      JOIN subjects AS sub ON m.subject = sub.subid
      JOIN assesscomp AS ac ON ac.acid = sub.component
      WHERE
          m.faculty = ? AND m.subject = ? AND m.tenure = ?
      GROUP BY
          m.msid, ac.acid;
    `;
    const [rows] = await db.execute(query, [faculty, subject, tenure]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching subsplitup by tenure:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
