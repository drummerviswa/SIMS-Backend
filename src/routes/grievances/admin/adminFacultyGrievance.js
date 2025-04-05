import { Router } from "express";
import { getFacultyGrievances } from "../../../controllers/grievances/admin/facultyGrievance.js";
const AdminFacultyGrievanceRoutes = Router();

AdminFacultyGrievanceRoutes.get("/", getFacultyGrievances);

export default AdminFacultyGrievanceRoutes;
