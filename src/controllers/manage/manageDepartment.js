import db from "../../db.js";

export const getAllDepartments = async (req, res) => {
  try {
    const [departments] = await db.query("SELECT * FROM department", {
      type: db.QueryTypes.SELECT,
    });
    if (departments.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }
    res.status(200).json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [department] = await db.query(
      "SELECT * FROM department WHERE id = ?",
      [id],
      { type: db.QueryTypes.SELECT }
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createDepartment = async (req, res) => {
  const { deptName, username, password } = req.body;
  try {
    if (!deptName || !username || !password) {
      return res
        .status(400)
        .json({ message: "deptName, username and password are required" });
    }
    const newDepartment = await db.query(
      "INSERT INTO department (deptName, username, password) VALUES (?, ?, ?)",
      [deptName, username, password]
    );
    res
      .status(201)
      .json({ message: "Department created successfully", newDepartment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { deptName, username, password } = req.body;
  try {
    if (!deptName || !username || !password) {
      return res
        .status(400)
        .json({ message: "deptName, username and password are required" });
    }
    const [updatedDepartment] = await db.query(
      "UPDATE department SET deptName = ?, username = ?, password = ? WHERE id = ?",
      [deptName, username, password, id]
    );
    if (updatedDepartment.affectedRows === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const [deletedDepartment] = await db.query(
      "DELETE FROM department WHERE id = ?",
      [id]
    );
    if (deletedDepartment.affectedRows === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
