import db from "../../database/db.js";

export const viewDegreeByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT d.*,dep.* FROM degree AS d JOIN department AS dep ON d.department = dep.deptid WHERE d.department = ?`,
      [departmentId]
    );
    console.log("Getting degrees for departmentId:", departmentId);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No degrees found for this department" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error fetching degrees by department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
