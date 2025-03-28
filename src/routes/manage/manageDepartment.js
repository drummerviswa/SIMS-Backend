import { Router } from "express";
import { getAllDepartments } from "../../controllers/manage/manageDepartment";

const manageDepartmentRoutes = Router();

manageDepartmentRoutes.get("/", getAllDepartments);
manageDepartmentRoutes.get("/:id", getAllDepartments);
manageDepartmentRoutes.post("/", getAllDepartments);
manageDepartmentRoutes.put("/:id", getAllDepartments);
manageDepartmentRoutes.delete("/:id", getAllDepartments);

export default manageDepartmentRoutes;
