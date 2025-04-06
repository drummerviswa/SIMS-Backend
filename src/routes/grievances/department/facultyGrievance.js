import { Router } from "express";
import {
  createFacultyGrievance,
  deleteFacultyGrievance,
  getFacultyGrievanceById,
  getFacultyGrievances,
  updateFacultyGrievance,
} from "../../../controllers/grievances/department/facultyGrievance.js";

const facultyGrievanceRouter = Router();

facultyGrievanceRouter.get("/:departmentId", getFacultyGrievances);
facultyGrievanceRouter.post("/:departmentId", createFacultyGrievance);
facultyGrievanceRouter.get("/:departmentId/:grievanceId", getFacultyGrievanceById);
facultyGrievanceRouter.put("/:departmentId/:grievanceId", updateFacultyGrievance);
facultyGrievanceRouter.delete("/:departmentId/:grievanceId", deleteFacultyGrievance);

export default facultyGrievanceRouter;
