import db from "../../database/db.js";

export const getStudentsForMarks = async (req, res) => {
  const { faculty, subject, tenure, batch, branch, degree, msid } = req.params;

  try {
    const [students] = await db.query(
      `SELECT
          stud.regNo,
          stud.sName,
          m.msid,
          c.criteriaName,
          m.mainWeightage,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'subSplitupId', s.subsplitid,
              'subCriteria', s.subCriteria,
              'subWeightage', s.subWeightage,
              'enteredMark', IFNULL(mk.mark, NULL),
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
        JOIN criteria AS c ON m.criteria = c.cid
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

export const getStudentsEntireMarks = async (req, res) => {
  const { facid, subCode, degree, branch } = req.params;
  try {
    const [students] = await db.query(
      `SELECT
    stud.regNo,
    stud.sName,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'msid', m.msid,
            'criteriaName', c.criteriaName,
            'mainWeightage', m.mainWeightage,
            'subSplitups', IFNULL(subsubs.subSplitups, JSON_ARRAY())
        )
    ) AS mainSplitups
FROM
    subassign AS sba
JOIN student AS stud
    ON sba.degree = stud.degree AND sba.branch = stud.branch AND sba.batch = stud.batch
JOIN mainsplitup AS m
    ON m.faculty = sba.faculty AND m.subject = sba.subject
JOIN subjects AS sub
    ON sub.subid = m.subject
JOIN criteria AS c
    ON m.criteria = c.cid
LEFT JOIN (
    SELECT
        s.mainsplitup,
        mk.studentRegno,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'subSplitupId', s.subsplitid,
                'subCriteria', s.subCriteria,
                'subWeightage', s.subWeightage,
                'enteredMark', IFNULL(mk.mark, NULL),
                'isLocked', IF(mk.mark IS NOT NULL, TRUE, FALSE)
            )
        ) AS subSplitups
    FROM
        subsplitup AS s
    LEFT JOIN marks AS mk
        ON mk.subCriteria = s.subsplitid
    GROUP BY
        s.mainsplitup, mk.studentRegno
) AS subsubs
    ON subsubs.mainsplitup = m.msid AND subsubs.studentRegno = stud.regNo
WHERE
    m.faculty = 1 AND sub.subCode = 'XC5251' AND sba.degree = 4 AND sba.branch = 4
GROUP BY
    stud.regNo
ORDER BY
    stud.regNo;

        `,
      [facid, subCode, degree, branch]
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const grantMarks = async (req, res) => {
  const students = req.body;

  if (!Array.isArray(students)) {
    return res
      .status(400)
      .json({ error: "Expected an array of student mark data" });
  }

  try {
    const allInsertValues = [];

    students.forEach((student) => {
      const {
        regNo,
        subject,
        criteria: mainCriteria,
        tenure,
        SubCriteriaBreakdown,
      } = student;

      if (!Array.isArray(SubCriteriaBreakdown)) return;

      SubCriteriaBreakdown.forEach((sub) => {
        const row = [
          regNo,
          subject,
          mainCriteria,
          sub.subSplitupId,
          sub.enteredMark,
          tenure,
        ];
        allInsertValues.push(row);
      });
    });

    if (allInsertValues.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid mark entries found to insert" });
    }

    const insertQuery = `
        INSERT INTO marks (studentRegno, subject, mainCriteria, subCriteria, mark, tenure)
        VALUES ?
      `;

    await db.query(insertQuery, [allInsertValues]);

    res.status(200).json({ message: "All marks inserted successfully" });
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
