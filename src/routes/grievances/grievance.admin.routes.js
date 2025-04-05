import { Router } from "express";
import AdminDepartmentGrievanceRoutes from "./admin/adminDepartmentGrievnace.js";
import AdminFacultyGrievanceRoutes from "./admin/adminFacultyGrievance.js";

const router = Router();

router.use("/department", AdminDepartmentGrievanceRoutes);
router.use("/faculty", AdminFacultyGrievanceRoutes);

export default router;
