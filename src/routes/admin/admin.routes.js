import adminManage from "../manage/manage.admin.routes.js";
import adminAuth from "./admin.auth.js";
import adminGrievance from "../grievances/grievance.admin.routes.js";
import academicPeriodRouter from "./academics.js";
import express from "express";

const adminRouter = express.Router();

adminRouter.use("/auth", adminAuth);
adminRouter.use("/manage", adminManage);
adminRouter.use("/grievance", adminGrievance);
adminRouter.use("/academicPeriod", academicPeriodRouter);

export default adminRouter;
