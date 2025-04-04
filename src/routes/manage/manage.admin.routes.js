import { Router } from "express";
import manageDepartmentRoutes from "./manageDepartment.js";
import manageBranchRoutes from "./manageBranch.js";
import manageDegreeRoutes from "./manageDegree.js";
import manageFacultyRoutes from "./manageFaculty.js";
import manageRegulationRoutes from "./manageRegulation.js";
import manageBatchRoutes from "./manageBatch.js";
import manageStudentRoutes from "./manageStudent.js";
import manageSubjectRoutes from "./manageSubject.js";

const adminManage = Router();

adminManage.get("/", (req, res) => {
  res.send("Manage Admin Route");
});
adminManage.use("/department", manageDepartmentRoutes);
adminManage.use("/branch", manageBranchRoutes);
adminManage.use("/degree", manageDegreeRoutes);
adminManage.use("/faculty", manageFacultyRoutes);
adminManage.use("/regulation", manageRegulationRoutes);
adminManage.use("/batch", manageBatchRoutes);
adminManage.use("/student",manageStudentRoutes);
adminManage.use("/subject",manageSubjectRoutes);

export default adminManage;
