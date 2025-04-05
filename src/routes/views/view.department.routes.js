import { Router } from "express";
import viewBranchByDepartmentRoutes from "./viewBranchByDepartment.js";
import viewDegreeByDepartmentRoutes from "./viewDegreeByDepartment.js";
import viewFacultyByDepartmentRoutes from "./viewFacultyByDepartment.js";

const viewsDepartmentRouter = Router();

viewsDepartmentRouter.use("/:departmentId/branch",viewBranchByDepartmentRoutes);
viewsDepartmentRouter.use("/:departmentId/degree",viewDegreeByDepartmentRoutes);
viewsDepartmentRouter.use("/:departmentId/faculty",viewFacultyByDepartmentRoutes);

export default viewsDepartmentRouter;