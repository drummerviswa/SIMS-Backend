import { Router } from "express";
import manageBatchRoutes from "./manageBatch.js";
import manageSubjectRoutes from "./manageSubject.js";
import manageStudentsByDeptRoutes from "./manageStudentsByDept.js";

const departmentManage = Router();

departmentManage.get("/", (req, res) => {
  res.send("Manage Department Route");
});
departmentManage.use("/batch", manageBatchRoutes);
departmentManage.use("/student",manageStudentsByDeptRoutes);
departmentManage.use("/subject",manageSubjectRoutes);

export default departmentManage;
