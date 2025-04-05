import adminManage from "../manage/manage.admin.routes.js";
import adminAuth from "./admin.auth.js";
import adminGrievance from "../grievances/grievance.admin.routes.js";
import express from "express";

const adminRouter = express.Router();

adminRouter.use("/auth", adminAuth);
adminRouter.use("/manage", adminManage);
adminRouter.use("/grievance", adminGrievance);

export default adminRouter;
