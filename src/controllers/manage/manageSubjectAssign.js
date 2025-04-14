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
    const query = `
                INSERT INTO subassign (subject, faculty, batch, degree, branch, semester) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
    const [result] = await db.query(query, [
      subject,
      faculty,
      batch,
      degree,
      branch,
      semester,
    ]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
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
