import express from "express";
import facultyAuth from "./fac.auth.js";
import facultyView from "../views/view.faculty.routes.js";

const facultyRouter = express.Router();

facultyRouter.use("/auth", facultyAuth);
facultyRouter.use("/view",facultyView);

export default facultyRouter;
