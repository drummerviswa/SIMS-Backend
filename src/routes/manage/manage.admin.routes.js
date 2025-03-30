import { Router } from "express";
import manageDepartmentRoutes from "./manageDepartment.js";

const adminManage = Router();
adminManage.get("/", (req, res) => {
  res.send("Manage Admin Route");
});
adminManage.use("/department", manageDepartmentRoutes);

export default adminManage;