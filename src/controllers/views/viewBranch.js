import db from "../../database/db.js";

export const viewBranchByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT b.*,d.degName,d.degSym FROM branch AS b JOIN degree AS d ON b.degree = d.degid JOIN department dep ON d.department = dep.deptid WHERE d.department = ?`,
      [departmentId]
    );
    console.log("Getting branches for departmentId:", departmentId);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No branches found for this department" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error fetching branches by department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
