import express from "express";
import {
  getStudentReport,
  getDepartmentReport,
  getFacultyReport,
  getOverallReport,
  getDepartmentsList, // New: For fetching department list for faculty/department selection
  getDetailedFacultyReport
} from "../controllers/reports.js";

const reportRouter = express.Router();

// The /student route for getting a list of all students is not used by the new frontend logic
// reportRouter.get("/student", getStudentsForReports); // Removed as frontend fetches by ID directly
reportRouter.get("/departmentlist", getDepartmentsList); // New route to fetch just departments for lists
reportRouter.get("/student/:id", getStudentReport);
reportRouter.get("/department/:id", getDepartmentReport);
reportRouter.get("/department", getDepartmentReport);
reportRouter.get("/faculty/:id", getFacultyReport);
reportRouter.get("/faculty/:id/detailed", getDetailedFacultyReport);
reportRouter.get("/overall", getOverallReport);

export default reportRouter;