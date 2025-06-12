// controllers/faculty/studentController.js
import db from "../../config/db.js";

// GET: List of students for a subject & tenure
export const getStudentsBySubject = async (req, res) => {
  const { faculty, subject, tenure, batch, degree, branch } = req.params;

  try {
    const [students] = await db.query(
      `SELECT DISTINCT 
         stud.regNo, stud.sname 
       FROM subassign AS sba
       JOIN student AS stud ON sba.degree = stud.degree 
                            AND sba.branch = stud.branch 
                            AND sba.batch = stud.batch
       WHERE sba.faculty = ?
         AND sba.subject = ?
         AND sba.batch = ?
         AND stud.degree = ?
         AND stud.branch = ?`,
      [faculty, subject, batch, degree, branch]
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching student list:", error);
    res.status(500).json({ error: "Failed to fetch student list" });
  }
};

// GET: Mark breakdown for a specific student
export const getMarksByStudent = async (req, res) => {
  const { faculty, subject, tenure, batch, degree, branch, regNo } = req.params;

  try {
    const [marks] = await db.query(
      `SELECT
         c.criteriaName,
         m.mainWeightage,
         ? AS tenure,
         JSON_ARRAYAGG(
           JSON_OBJECT(
             'subCriteria', s.subCriteria,
             'subWeightage', s.subWeightage,
             'enteredMark', mk.mark,
             'isLocked', IF(mk.mark IS NOT NULL, true, false)
           )
         ) AS StudentMarksBreakdown
       FROM subassign AS sba
       JOIN student AS stud ON sba.degree = stud.degree 
                            AND sba.branch = stud.branch 
                            AND sba.batch = stud.batch
       JOIN mainsplitup AS m ON m.faculty = sba.faculty 
                            AND m.subject = sba.subject 
                            AND m.tenure = ?
       LEFT JOIN subsplitup AS s ON s.mainsplitup = m.msid
       JOIN criteria AS c ON m.criteria = c.cid
       LEFT JOIN marks AS mk ON mk.studentRegno = stud.regNo 
                            AND mk.subject = m.subject
                            AND mk.mainCriteria = m.criteria
                            AND mk.subCriteria = s.subsplitid
                            AND mk.tenure = ?
       WHERE sba.faculty = ?
         AND sba.subject = ?
         AND sba.batch = ?
         AND stud.degree = ?
         AND stud.branch = ?
         AND stud.regNo = ?
       GROUP BY c.criteriaName, m.mainWeightage
       ORDER BY c.criteriaName`,
      [
        tenure,       // Selected tenure (for JSON)
        tenure,       // For m.tenure
        tenure,       // For mk.tenure
        faculty,
        subject,
        batch,
        degree,
        branch,
        regNo,
      ]
    );

    res.status(200).json(marks);
  } catch (error) {
    console.error("Error fetching student marks:", error);
    res.status(500).json({ error: "Failed to fetch student marks" });
  }
};
