import express from "express";
import deptAuth from "./dept.auth.js";

const departmentRouter = express.Router();

departmentRouter.use("/auth", deptAuth);

export default departmentRouter;
