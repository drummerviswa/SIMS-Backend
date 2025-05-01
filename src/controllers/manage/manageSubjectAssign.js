import e from "express";
import db from "../../database/db.js";
//assignid	subject	faculty	batch	degree	branch	semester

export const getSubjectAssignByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const query = `
            SELECT sba.*,sub.*,fac.*,bat.*,deg.*,br.* FROM subassign AS sba
            JOIN subjects AS sub ON sba.subject=sub.subid 
            JOIN faculty AS fac ON sba.faculty=fac.facid 
            JOIN batch AS bat ON sba.batch=bat.batchid 
            JOIN degree AS deg ON sba.degree=deg.degid 
            JOIN branch AS br ON sba.branch=br.bid 
            WHERE fac.primaryDept = ?
        `;
    const [rows] = await db.query(query, [departmentId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubjectAssignByFaculty = async (req, res) => {
  const { facultyId } = req.query;
  try {
    const query = `
            SELECT sba.*,sub.*,fac.*,bat.*,deg.*,br.* FROM subassign AS sba
            JOIN subjects AS sub ON sba.subject=sub.subid 
            JOIN faculty AS fac ON sba.faculty=fac.facid 
            JOIN batch AS bat ON sba.batch=bat.batchid 
            JOIN degree AS deg ON sba.degree=deg.degid 
            JOIN branch AS br ON sba.branch=br.bid 
            WHERE fac.facid = ?
        `;
    const [rows] = await db.query(query, [facultyId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createSubjectAssign = async (req, res) => {
  const { subject, faculty, batch, degree, branch, semester } = req.body;

  try {
    // Step 1: Insert subject assignment
    const insertQuery = `
      INSERT INTO subassign (subject, faculty, batch, degree, branch, semester) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [insertResult] = await db.query(insertQuery, [
      subject,
      faculty,
      batch,
      degree,
      branch,
      semester,
    ]);

    // Step 2: Fetch Assessment Criteria ID
    const [criteriaResult] = await db.query(
      "SELECT * FROM criteria WHERE criteriaName = 'Assessment'"
    );
    if (criteriaResult.length === 0) {
      return res.status(404).json({ message: "Assessment criteria not found" });
    }
    const criteriaId = criteriaResult[0].cid;

    // Step 3: Fetch written marks from assesscomp for the subject
    const [writtenMarksResult] = await db.query(
      `SELECT ac.* 
       FROM assesscomp AS ac 
       JOIN subjects AS sub ON ac.acid = sub.component 
       WHERE sub.subid = ?`,
      [subject]
    );
    if (writtenMarksResult.length === 0) {
      return res
        .status(404)
        .json({ message: "Written marks not found for subject" });
    }
    const writtenMarksValue = writtenMarksResult[0].written;

    // Step 4: Insert into mainsplitup for assess1 and assess2
    const [assess1Result] = await db.query(
      `INSERT INTO mainsplitup 
       (faculty, subject, criteria, mainWeightage, tenure, writtenTest) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [faculty, subject, criteriaId, writtenMarksValue, "assess1", true]
    );

    const [assess2Result] = await db.query(
      `INSERT INTO mainsplitup 
       (faculty, subject, criteria, mainWeightage, tenure, writtenTest) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [faculty, subject, criteriaId, writtenMarksValue, "assess2", true]
    );
    const [assess1SubSplitupResult] = await db.query(
      `
      INSERT INTO subsplitup(faculty,subject,mainsplitup,subCriteria,subWeightage)
      VALUES(?,?,?,?,?)`,
      [
        faculty,
        subject,
        assess1Result.insertId,
        "Assessment",
        writtenMarksValue,
      ]
    );
    const [assess2SubSplitupResult] = await db.query(
      `
      INSERT INTO subsplitup(faculty,subject,mainsplitup,subCriteria,subWeightage)
      VALUES(?,?,?,?,?)`,
      [
        faculty,
        subject,
        assess2Result.insertId,
        "Assessment",
        writtenMarksValue,
      ]
    );

    // Step 5: Respond to client
    res.status(201).json({
      id: insertResult.insertId,
      message: "Subject assignment created successfully",
      assess1: [assess1Result, assess1SubSplitupResult],
      assess2: [assess2Result, assess2SubSplitupResult],
    });
  } catch (error) {
    console.error("Error creating subject assignment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSubjectAssign = async (req, res) => {
  const { assignId } = req.params;
  const { subject, faculty, batch, degree, branch, semester } = req.body;
  try {
    const query = `
            UPDATE subassign 
            SET subject = ?, faculty = ?, batch = ?, degree = ?, branch = ?, semester = ? 
            WHERE assignid = ?
        `;
    const [result] = await db.query(query, [
      subject,
      faculty,
      batch,
      degree,
      branch,
      semester,
      assignId,
    ]);
    res
      .status(200)
      .json({ message: "Subject assignment updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteSubjectAssign = async (req, res) => {
  const { assignId } = req.params;
  try {
    const query = `
                DELETE FROM subassign 
                WHERE assignid = ?
            `;
    await db.query(query, [assignId]);
    res
      .status(200)
      .json({ message: "Subject assignment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubjectAssignById = async (req, res) => {
  const { assignId } = req.params;
  try {
    const query = `
            SELECT sba.*,sub.*,fac.*,bat.*,deg.*,br.* FROM subassign AS sba
            JOIN subjects AS sub ON sba.subject=sub.subid 
            JOIN faculty AS fac ON sba.faculty=fac.facid 
            JOIN batch AS bat ON sba.batch=bat.batchid 
            JOIN degree AS deg ON sba.degree=deg.degid 
            JOIN branch AS br ON sba.branch=br.bid 
            WHERE assignid = ?
        `;
    const [rows] = await db.query(query, [assignId]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubjectAssignByFacultySubject = async (req, res) => {
  const { facultyId, subjectId } = req.params;
  try {
    const query = `
            SELECT sba.*,sub.*,fac.*,bat.*,deg.*,br.* FROM subassign AS sba
            JOIN subjects AS sub ON sba.subject=sub.subid 
            JOIN faculty AS fac ON sba.faculty=fac.facid 
            JOIN batch AS bat ON sba.batch=bat.batchid 
            JOIN degree AS deg ON sba.degree=deg.degid 
            JOIN branch AS br ON sba.branch=br.bid 
            WHERE fac.facid = ? AND sub.subid = ?
        `;
    const [rows] = await db.query(query, [facultyId, subjectId]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
