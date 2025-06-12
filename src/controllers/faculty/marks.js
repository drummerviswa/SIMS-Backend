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
export const getStudentsForMarksOther = async (req, res) => {
  const { faculty, subject, tenure, batch, branch, degree, msid } = req.params;

  try {
    const [students] = await db.query(
      `SELECT 
  stud.regNo, 
  stud.sName, 
  m.asid AS mainsplitup_msid, 
  c.criteriaName AS criteriaName, 
  m.mainWeightage, 
  m.writtenTest, 
  COALESCE(mk.mainCriteria, m.criteria) AS mainCriteria,
  COALESCE(mk.tenure, m.tenure) AS tenure,
  COALESCE(mk.subject, m.subject) AS subject,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'subSplitupId', s.assignsubid,
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
JOIN assignmentsplitup AS m ON m.faculty = sba.faculty 
                    AND m.subject = sba.subject 
                    AND m.tenure = ? 
                    AND m.asid = ? 
LEFT JOIN assignmentsubsplitup AS s ON s.mainsplitup = m.asid 
JOIN criteria AS c ON m.criteria = c.cid 
JOIN assesscomp AS ac ON ac.acid = sub.component 
LEFT JOIN marks AS mk 
  ON mk.studentRegno = stud.regNo 
 AND mk.subject = m.subject 
 AND mk.subCriteria = s.assignsubid
 AND mk.tenure = ?

GROUP BY 
  stud.regNo, stud.sName, m.asid, c.criteriaName, m.mainWeightage, mainCriteria, tenure, subject
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

export const getStudentsMarksByAssessment = async (req, res) => {
  const { faculty, subject, tenure, degree, branch, batch } = req.params;

  try {
    const [students] = await db.query(
      `
      SELECT
        c.criteriaName,
        m.mainWeightage,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'regNo', stud.regNo,
            'studentName', stud.sname,
            'subSplitupId', s.subsplitid,
            'subCriteria', s.subCriteria,
            'subWeightage', s.subWeightage,
            'enteredMark', mk.mark,
            'isLocked', IF(mk.mark IS NOT NULL, true, false)
          )
        ) AS StudentMarksBreakdown
      FROM subassign AS sba
      JOIN faculty AS f ON f.facid = sba.faculty
      JOIN subjects AS sub ON sub.subid = sba.subject
      JOIN student AS stud ON sba.degree = stud.degree AND sba.branch = stud.branch AND sba.batch = stud.batch
      JOIN mainsplitup AS m ON m.faculty = sba.faculty AND m.subject = sba.subject AND m.tenure = ?
      LEFT JOIN subsplitup AS s ON s.mainsplitup = m.msid
      JOIN criteria AS c ON c.cid = m.criteria
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
      GROUP BY c.criteriaName, m.mainWeightage
      ORDER BY c.criteriaName;
      `,
      [tenure, tenure, faculty, subject, batch, degree, branch]
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching assessment marks:", error);
    res.status(500).json({ error: "Failed to fetch assessment marks" });
  }
};
export const getStudentsMarksByAssignment = async (req, res) => {
  const { faculty, subject, tenure, degree, branch, batch } = req.params;

  try {
    const [students] = await db.query(
      `
      SELECT
        c.criteriaName,
        m.mainWeightage,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'regNo', stud.regNo,
            'studentName', stud.sname,
            'subSplitupId', s.assignsubid,
            'subCriteria', s.subCriteria,
            'subWeightage', s.subWeightage,
            'enteredMark', mk.mark,
            'isLocked', IF(mk.mark IS NOT NULL, true, false)
          )
        ) AS StudentMarksBreakdown
      FROM subassign AS sba
      JOIN faculty AS f ON f.facid = sba.faculty
      JOIN subjects AS sub ON sub.subid = sba.subject
      JOIN student AS stud ON sba.degree = stud.degree AND sba.branch = stud.branch AND sba.batch = stud.batch
      JOIN assignmentsplitup AS m ON m.faculty = sba.faculty AND m.subject = sba.subject AND m.tenure = ?
      LEFT JOIN assignmentsubsplitup AS s ON s.mainsplitup = m.asid
      JOIN criteria AS c ON c.cid = m.criteria
      LEFT JOIN marks AS mk ON mk.studentRegno = stud.regNo 
                           AND mk.subject = m.subject
                           AND mk.mainCriteria = m.criteria
                           AND mk.subCriteria = s.assignsubid
                           AND mk.tenure = ?
      WHERE
        m.faculty = ? 
        AND m.subject = ?
        AND sba.batch = ?
        AND stud.degree = ?
        AND stud.branch = ?
      GROUP BY c.criteriaName, m.mainWeightage
      ORDER BY c.criteriaName;
      `,
      [tenure, tenure, faculty, subject, batch, degree, branch]
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching assignment marks:", error);
    res.status(500).json({ error: "Failed to fetch assignment marks" });
  }
};

export const getStudentsCombinedAssessmentMarks = async (req, res) => {
  const { faculty, subject, degree, branch, batch } = req.params;

  try {
    const [students] = await db.query(
      `
      SELECT
        COALESCE(m.tenure, am.tenure) AS tenure,
        c.criteriaName,
        COALESCE(m.mainWeightage, am.mainWeightage) AS mainWeightage,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'regNo', stud.regNo,
            'studentName', stud.sname,
            'subSplitupId', COALESCE(s.subsplitid, ss.assignsubid),
            'subCriteria', COALESCE(s.subCriteria, ss.subCriteria),
            'subWeightage', COALESCE(s.subWeightage, ss.subWeightage),
            'enteredMark', mk.mark,
            'isLocked', IF(mk.mark IS NOT NULL, true, false)
          )
        ) AS StudentMarksBreakdown
      FROM subassign AS sba
      JOIN faculty AS f ON f.facid = sba.faculty
      JOIN subjects AS sub ON sub.subid = sba.subject
      JOIN student AS stud ON sba.degree = stud.degree AND sba.branch = stud.branch AND sba.batch = stud.batch
      LEFT JOIN mainsplitup AS m ON m.faculty = sba.faculty AND m.subject = sba.subject
      LEFT JOIN subsplitup AS s ON s.mainsplitup = m.msid
      LEFT JOIN assignmentsplitup AS am ON am.faculty = sba.faculty AND am.subject = sba.subject
      LEFT JOIN assignmentsubsplitup AS ss ON ss.mainsplitup = am.asid
      LEFT JOIN criteria AS c ON c.cid = COALESCE(m.criteria, am.criteria)
      LEFT JOIN marks AS mk ON mk.studentRegno = stud.regNo
        AND mk.subject = sba.subject
        AND mk.tenure = COALESCE(m.tenure, am.tenure)
        AND mk.mainCriteria = COALESCE(m.criteria, am.criteria)
        AND mk.subCriteria = COALESCE(s.subsplitid, ss.assignsubid)
      WHERE
        sba.faculty = ?
        AND sba.subject = ?
        AND sba.batch = ?
        AND stud.degree = ?
        AND stud.branch = ?
        AND COALESCE(m.tenure, am.tenure) IN ('assess1', 'assess2')
      GROUP BY
        tenure, c.criteriaName, mainWeightage
      ORDER BY
        tenure, c.criteriaName;
    `,
      [faculty, subject, batch, degree, branch]
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching combined assessment marks:", error);
    res.status(500).json({ error: "Failed to fetch combined marks" });
  }
};

export const getStudentsTotalMarks = async (req, res) => {
  const { faculty, subject, degree, branch, batch } = req.params;

  try {
    const [students] = await db.query(
      `
      SELECT
        stud.regNo,
        stud.sname AS studentName,
        SUM(CASE WHEN mk.tenure = 'assess1' THEN mk.mark ELSE 0 END) AS assess1Marks,
        SUM(CASE WHEN mk.tenure = 'assess2' THEN mk.mark ELSE 0 END) AS assess2Marks,
        SUM(CASE WHEN mk.tenure = 'assignment' THEN mk.mark ELSE 0 END) AS assignmentMarks,
        SUM(mk.mark) AS totalMarks
      FROM
        student AS stud
      JOIN
        subassign AS sba ON sba.degree = stud.degree AND sba.branch = stud.branch AND sba.batch = stud.batch
      LEFT JOIN
        marks AS mk ON mk.studentRegno = stud.regNo AND mk.subject = sba.subject
      WHERE
        sba.faculty = ?
        AND sba.subject = ?
        AND sba.batch = ?
        AND stud.degree = ?
        AND stud.branch = ?
      GROUP BY
        stud.regNo, stud.sname
      ORDER BY
        stud.regNo;
      `,
      [faculty, subject, batch, degree, branch]
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching total marks:", error);
    res.status(500).json({ error: "Failed to fetch total marks" });
  }
};

export const getStudentsForSubject = async (req, res) => {
  const { faculty, subject } = req.params;
  try {
    const [students] = await db.query(
      `SELECT DISTINCT s.regNo, s.sname
       FROM subassign sa
       JOIN student s ON s.degree = sa.degree AND s.branch = sa.branch AND s.batch = sa.batch
       WHERE sa.faculty = ? AND sa.subject = ?`,
      [faculty, subject]
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students list:", error);
    res.status(500).json({ error: "Failed to fetch students list" });
  }
};

// Get all marks for a specific student
// backend/controllers/marksController.js

export const getMarksByStudent = async (req, res) => {
  const { faculty, subject, regNo } = req.params;

  try {
    const [marks] = await db.query(
      `
      SELECT 
        mk.tenure,
        mk.mark,
        mk.mainCriteria,
        mk.subCriteria,
        mk.subject,
        c.criteriaName,
        ms.mainWeightage,
        ss.subCriteria AS subCriteriaName,
        ss.subWeightage,
        mk.mark IS NOT NULL AS isLocked
      FROM marks AS mk
      JOIN mainsplitup AS ms ON ms.criteria = mk.mainCriteria AND ms.subject = mk.subject AND ms.faculty = ?
      LEFT JOIN subsplitup AS ss ON ss.subsplitid = mk.subCriteria
      LEFT JOIN criteria AS c ON c.cid = mk.mainCriteria
      WHERE mk.subject = ? AND mk.studentRegno = ?
      ORDER BY mk.tenure, mk.mainCriteria;
      `,
      [faculty, subject, regNo]
    );

    const groupedByTenure = marks.reduce((acc, row) => {
      if (!acc[row.tenure]) acc[row.tenure] = [];
      acc[row.tenure].push({
        ...row,
        type: row.tenure === "assignment" ? "assignment" : "assessment",
        StudentMarksBreakdown: [
          {
            subCriteria: row.subCriteriaName,
            subWeightage: row.subWeightage,
            enteredMark: row.mark,
            isLocked: !!row.isLocked,
          },
        ],
      });
      return acc;
    }, {});

    const totalMarks = marks.reduce((sum, row) => sum + (row.mark ?? 0), 0);

    res.status(200).json({
      marks: Object.values(groupedByTenure).flat(),
      totalMarks,
    });
  } catch (error) {
    console.error("Error fetching marks for student:", error);
    res.status(500).json({ error: "Failed to fetch marks for student" });
  }
};
