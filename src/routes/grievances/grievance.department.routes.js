import { Router } from "express";
import contactAdminByDepartmentRouter from "./department/contactAdminByDepartment.js";
import facultyGrievanceRouter from "./department/facultyGrievance.js";

const grievanceDepartmentRouter = Router();

grievanceDepartmentRouter.use("/contactAdmin", contactAdminByDepartmentRouter);
grievanceDepartmentRouter.use("/faculty", facultyGrievanceRouter);

export default grievanceDepartmentRouter;
