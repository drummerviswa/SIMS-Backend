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
manageDepartmentRoutes.post("/", createDepartment);
manageDepartmentRoutes.get("/:id", getDepartmentById);
manageDepartmentRoutes.put("/:id", updateDepartment);
manageDepartmentRoutes.delete("/:id", deleteDepartment);

export default manageDepartmentRoutes;
