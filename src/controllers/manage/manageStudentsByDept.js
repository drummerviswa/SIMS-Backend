import db from "../../database/db.js";

//regNo	sName	degree	branch	batch

export const getAllStudents = async (req, res) => {
  try {
    const [students] = await db.query(
      "SELECT s.*,bat.batchName,deg.degName,br.branchName,dep.deptName FROM student AS s JOIN batch AS bat ON s.batch = bat.batchid JOIN branch AS br ON s.branch = br.bid JOIN degree AS deg ON s.degree = deg.degid JOIN department AS dep ON deg.department = dep.deptid"
    );
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const getStudentById = async (req, res) => {
  const regNo = req.params.regNo;
  try {
    const [student] = await db.query(
      "SELECT s.*,bat.batchName,deg.degName,br.branchName,dep.deptName FROM student AS s JOIN batch AS bat ON s.batch = bat.batchid JOIN branch AS br ON s.branch = br.bid JOIN degree AS deg ON s.degree = deg.degid JOIN department AS dep ON deg.department = dep.deptid WHERE s.regNo = ?",
      [regNo]
    );
    if (student.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

export const addStudent = async (req, res) => {
  const departmentId = req.params.departmentId;
  const { regNo, sName, degree, branch, batch } = req.body;
  try {
    const [existingStudent] = await db.query(
      "SELECT * FROM student WHERE regNo = ? AND department = ?",
      [regNo, departmentId]
    );
    if (existingStudent.length > 0) {
      return res.status(400).json({ error: "Student already exists" });
    }

    const [result] = await db.query(
      "INSERT INTO student (regNo, sName, degree, branch, batch) VALUES (?, ?, ?, ?, ?)",
      [regNo, sName, degree, branch, batch]
    );
    res
      .status(201)
      .json({ message: "Student added successfully", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Failed to add student" });
  }
};

export const updateStudent = async (req, res) => {
  const regNo = req.params.regNo;
  const { sName, degree, branch, batch } = req.body;
  try {
    const result = await db.query(
      "UPDATE student SET sName = ?, degree = ?, branch = ?, batch = ? WHERE regNo = ?",
      [sName, degree, branch, batch, regNo]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update student" });
  }
};

export const deleteStudent = async (req, res) => {
  const regNo = req.params.regNo;
  try {
    const result = await db.query("DELETE FROM student WHERE regNo = ?", [
      regNo,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
};
export const getStudentsByBatch = async (req, res) => {
  const batchId = req.params.batchId;
  try {
    const students = await db.query(
      "SELECT s.*,bat.batchName,deg.degName,br.branchName,dep.deptName FROM student AS s JOIN batch AS bat ON s.batch = bat.batchid JOIN branch AS br ON s.branch = br.bid JOIN degree AS deg ON s.degree = deg.degid JOIN department AS dep ON deg.department = dep.deptid WHERE b.batchid = ?",
      [batchId]
    );
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};
export const getStudentsByDegree = async (req, res) => {
  const degreeId = req.params.degreeId;
  try {
    const students = await db.query(
      "SELECT s.*,bat.batchName,deg.degName,br.branchName,dep.deptName FROM student AS s JOIN batch AS bat ON s.batch = bat.batchid JOIN branch AS br ON s.branch = br.bid JOIN degree AS deg ON s.degree = deg.degid JOIN department AS dep ON deg.department = dep.deptid WHERE d.degid = ?",
      [degreeId]
    );
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const getStudentsByBranch = async (req, res) => {
  const branchId = req.params.branchId;
  try {
    const students = await db.query(
      "SELECT s.*,bat.batchName,deg.degName,br.branchName,dep.deptName FROM student AS s JOIN batch AS bat ON s.batch = bat.batchid JOIN branch AS br ON s.branch = br.bid JOIN degree AS deg ON s.degree = deg.degid JOIN department AS dep ON deg.department = dep.deptid WHERE br.bid = ?",
      [branchId]
    );
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const getStudentsByDepartment = async (req, res) => {
  const departmentId = req.params.departmentId;
  try {
    const [students] = await db.query(
      "SELECT s.*,bat.batchName,deg.degName,br.branchName,dep.deptName FROM student AS s JOIN batch AS bat ON s.batch = bat.batchid JOIN branch AS br ON s.branch = br.bid JOIN degree AS deg ON s.degree = deg.degid JOIN department AS dep ON deg.department = dep.deptid WHERE dep.deptid = ?",
      [departmentId]
    );
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};
