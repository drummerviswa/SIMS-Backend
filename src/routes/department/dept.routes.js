import express from "express";
import deptAuth from "./dept.auth.js";
import deptManage from "../manage/manage.department.routes.js";
import deptView from "../views/view.department.routes.js";

const departmentRouter = express.Router();

departmentRouter.use("/auth", deptAuth);
departmentRouter.use("/manage", deptManage);
departmentRouter.use("/view", deptView);

export default departmentRouter;
