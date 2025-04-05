import { Router } from "express";
import contactAdminByFacultyRouter from "./faculty/contactAdminByFaculty.js";
import contactDepartmentRouter from "./faculty/contactDepartment.js";

const grievanceFacultyRouter = Router();

grievanceFacultyRouter.use("/contactAdmin", contactAdminByFacultyRouter);
grievanceFacultyRouter.use("/contactDepartment", contactDepartmentRouter);

export default grievanceFacultyRouter;
