import { Router } from "express";
import manageBatchRoutes from "./manageBatch.js";
import manageSubjectRoutes from "./manageSubjectDepartment.js";
import manageStudentsByDeptRoutes from "./manageStudentsByDept.js";
import manageSubjectAssignRoutes from "./manageSubjectAssign.js";

const departmentManage = Router();

departmentManage.get("/", (req, res) => {
  res.send("Manage Department Route");
});
departmentManage.use("/batch", manageBatchRoutes);
departmentManage.use("/student", manageStudentsByDeptRoutes);
departmentManage.use("/subject", manageSubjectRoutes);
departmentManage.use("/subjectAssign", manageSubjectAssignRoutes);

export default departmentManage;
