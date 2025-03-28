import adminAuth from "./admin.auth.js";
import express from "express";

const adminRouter = express.Router();

adminRouter.use("/auth", adminAuth);
adminRouter.use("/manage", () => {});

export default adminRouter;
