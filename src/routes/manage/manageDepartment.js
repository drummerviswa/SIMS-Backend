import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from "../../controllers/manage/manageDepartment.js";

const manageDepartmentRoutes = Router();

manageDepartmentRoutes.get("/", getAllDepartments);
manageDepartmentRoutes.get("/:id", getDepartmentById);
manageDepartmentRoutes.post("/", createDepartment);
manageDepartmentRoutes.put("/:id", updateDepartment);
manageDepartmentRoutes.delete("/:id", deleteDepartment);

export default manageDepartmentRoutes;
