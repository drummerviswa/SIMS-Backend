import { Router } from "express";
import {
  createDepartmentGrievance,
  deleteDepartmentGrievance,
  getDepartmentGrievanceById,
  getDepartmentGrievances,
  updateDepartmentGrievance,
} from "../../../controllers/grievances/admin/departmentGrievance.js";

const AdminDepartmentGrievanceRoutes = Router();

AdminDepartmentGrievanceRoutes.get("/", getDepartmentGrievances);
AdminDepartmentGrievanceRoutes.get("/:id", getDepartmentGrievanceById);
AdminDepartmentGrievanceRoutes.post("/", createDepartmentGrievance);
AdminDepartmentGrievanceRoutes.put("/:id", updateDepartmentGrievance);
AdminDepartmentGrievanceRoutes.delete("/:id", deleteDepartmentGrievance);

export default AdminDepartmentGrievanceRoutes;
