import express from "express";
import facultyAuth from "./fac.auth.js";
import facultyView from "../views/view.faculty.routes.js";
import facultyGrievance from "../grievances/grievance.faculty.route.js";

const facultyRouter = express.Router();

facultyRouter.use("/auth", facultyAuth);
facultyRouter.use("/view",facultyView);
facultyRouter.use("/grievance",facultyGrievance);

export default facultyRouter;
