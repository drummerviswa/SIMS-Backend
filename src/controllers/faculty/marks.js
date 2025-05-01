import db from "../../database/db.js";

export const getStudentsForMarks = async (req, res) => {
  const { faculty, subject, tenure, batch, branch, degree, msid } = req.params;

  try {
    const [students] = await db.query(
      `SELECT 
  stud.regNo, 
  stud.sName, 
  m.msid AS mainsplitup_msid, 
  c.criteriaName AS criteriaName, 
  m.mainWeightage, 
  m.writtenTest, 
  COALESCE(mk.mainCriteria, m.criteria) AS mainCriteria,
  COALESCE(mk.tenure, m.tenure) AS tenure,
  COALESCE(mk.subject, m.subject) AS subject,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'subSplitupId', s.subsplitid,
      'subCriteria', s.subCriteria,
      'subWeightage', s.subWeightage,
      'enteredMark', IFNULL(mk.mark, NULL),
      'isLocked', IF(mk.mark IS NOT NULL, true, false)
    )
  ) AS SubCriteriaBreakdown 
FROM subassign AS sba 
JOIN faculty AS f ON f.facid = sba.faculty 
JOIN subjects AS sub ON sub.subid = sba.subject 
JOIN student AS stud ON sba.degree = stud.degree 
                  AND sba.branch = stud.branch 
                  AND sba.batch = stud.batch 
JOIN mainsplitup AS m ON m.faculty = sba.faculty 
                    AND m.subject = sba.subject 
                    AND m.tenure = ? 
                    AND m.msid = ? 
LEFT JOIN subsplitup AS s ON s.mainsplitup = m.msid 
JOIN criteria AS c ON m.criteria = c.cid 
JOIN assesscomp AS ac ON ac.acid = sub.component 
LEFT JOIN marks AS mk 
  ON mk.studentRegno = stud.regNo 
 AND mk.subject = m.subject 
 AND mk.subCriteria = s.subsplitid
 AND mk.tenure = ?

GROUP BY 
  stud.regNo, stud.sName, m.msid, c.criteriaName, m.mainWeightage, mainCriteria, tenure, subject
ORDER BY 
  stud.regNo;

        `,
      [
        tenure, // for m.tenure
        msid, // for m.msid
        tenure, // for mk.tenure
        faculty, // for m.faculty
        subject, // for m.subject
        batch, // for sba.batch
        degree, // for stud.degree
        branch, // for stud.branch
      ]
    );
    console.log(students.map((student) => student.SubCriteriaBreakdown));
    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const getStudentsEntireMarks = async (req, res) => {
  const { faculty, subject, tenure, degree, branch, batch, msid } = req.params;
  try {
    const [students] = await db.query(
      `SELECT
  stud.regNo,
  stud.sName,
  m.msid,
  c.criteriaName AS criteriaName,
  m.mainWeightage,
  m.writtenTest,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'subSplitupId', s.subsplitid,
      'subCriteria', s.subCriteria,
      'subWeightage', s.subWeightage,
      'enteredMark', mk.mark,
      'isLocked', IF(mk.mark IS NOT NULL, true, false)
    )
  ) AS SubCriteriaBreakdown
FROM
  subassign AS sba
JOIN faculty AS f ON f.facid = sba.faculty
JOIN subjects AS sub ON sub.subid = sba.subject
JOIN student AS stud ON sba.degree = stud.degree 
                      AND sba.branch = stud.branch 
                      AND sba.batch = stud.batch
JOIN mainsplitup AS m ON m.faculty = sba.faculty 
                       AND m.subject = sba.subject 
                       AND m.tenure = ? 
                       AND m.msid = ?
LEFT JOIN subsplitup AS s ON s.mainsplitup = m.msid
JOIN criteria AS c ON m.criteria = c.cid  -- Correctly join criteria table
JOIN assesscomp AS ac ON ac.acid = sub.component
LEFT JOIN marks AS mk ON mk.studentRegno = stud.regNo 
                       AND mk.subject = m.subject
                       AND mk.mainCriteria = m.criteria
                       AND mk.subCriteria = s.subsplitid
                       AND mk.tenure = ?
WHERE
  m.faculty = ? 
  AND m.subject = ? 
  AND sba.batch = ? 
  AND stud.degree = ? 
  AND stud.branch = ?
GROUP BY
  stud.regNo, stud.sName, m.msid, c.criteriaName, m.mainWeightage
ORDER BY
  stud.regNo;
        `,
      [
        tenure, // for m.tenure
        msid, // for m.msid
        tenure, // for mk.tenure
        faculty, // for m.faculty
        subject, // for m.subject
        batch, // for sba.batch
        degree, // for stud.degree
        branch, // for stud.branch
      ]
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const grantMarks = async (req, res) => {
  const students = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    return res
      .status(400)
      .json({ error: "Expected a non-empty array of student mark data" });
  }

  try {
    // Optional: Log the incoming payload for debugging
    console.log("Received students data:", JSON.stringify(students, null, 2));

    const valuesToInsert = students.flatMap(
      ({ regNo, subject, mainCriteria, tenure, SubCriteriaBreakdown }) => {
        // Validate critical fields before proceeding
        if (
          !regNo ||
          !subject ||
          !mainCriteria ||
          !tenure ||
          !Array.isArray(SubCriteriaBreakdown)
        ) {
          console.warn("Skipping invalid entry due to missing fields:", {
            regNo,
            subject,
            mainCriteria,
            tenure,
          });
          return [];
        }

        return SubCriteriaBreakdown.map((sub) => {
          // Also validate subSplitupId and enteredMark
          if (sub?.subSplitupId == null || sub?.enteredMark == null) {
            console.warn("Skipping invalid sub-criteria entry:", sub);
            return null;
          }

          return [
            regNo,
            subject,
            mainCriteria,
            sub.subSplitupId,
            sub.enteredMark,
            tenure,
          ];
        }).filter(Boolean); // Remove any nulls
      }
    );

    if (valuesToInsert.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid entries found to insert." });
    }

    const sql = `
      INSERT INTO marks (studentRegno, subject, mainCriteria, subCriteria, mark, tenure)
      VALUES ?
      ON DUPLICATE KEY UPDATE mark = VALUES(mark)
    `;

    const [result] = await db.query(sql, [valuesToInsert]);
    console.log("Marks upserted successfully", result);

    res.status(200).json({ message: "Marks inserted/updated successfully" });
  } catch (error) {
    console.error("Error inserting marks:", error);
    res.status(500).json({ error: "Failed to insert marks" });
  }
};

export const updateMarks = async (req, res) => {
  const { faculty, subject, tenure } = req.params;
  const students = req.body;

  // Check if the required data is passed
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    // Loop through each student in the input data
    for (const student of students) {
      const { regNo, SubCriteriaBreakdown } = student;

      // Loop through each sub-criteria for the student
      for (const sub of SubCriteriaBreakdown) {
        const { subSplitupId, enteredMark } = sub;

        // Perform the UPDATE operation in the database for each sub-criteria
        await db.query(
          `UPDATE marks 
               SET mark = ? 
               WHERE studentRegno = ? 
                 AND subject = ? 
                 AND mainCriteria = ? 
                 AND subCriteria = ? 
                 AND tenure = ?`,
          [
            enteredMark, // the mark to update
            regNo, // studentRegno
            subject, // subject
            faculty, // mainCriteria (faculty)
            subSplitupId, // subCriteria (subSplitupId)
            tenure, // tenure
          ]
        );
      }
    }

    // Return a success message after the marks have been updated
    res.status(200).json({ message: "Marks updated successfully." });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ message: "Failed to update marks." });
  }
};
