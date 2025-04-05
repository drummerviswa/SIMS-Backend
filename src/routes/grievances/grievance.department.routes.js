import { Router } from "express";
import contactAdminByDepartmentRouter from "./department/contactAdminByDepartment.js";

const grievanceDepartmentRouter = Router();

grievanceDepartmentRouter.use(
  "/contactAdmin",
  contactAdminByDepartmentRouter
);

export default grievanceDepartmentRouter;
