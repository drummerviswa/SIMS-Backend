import express from "express";
import facultyAuth from "./fac.auth.js";
import facultyView from "../views/view.faculty.routes.js";
import facultyGrievance from "../grievances/grievance.faculty.route.js";
import facultySubAssigned from "./assignedSub.js";
import facultyCriteria from "./criteria.js";
import facultyMainSplitup from "./mainSplitup.js";
import facultySubSplitup from "./subSplitup.js";
import facultyMarks from "./marks.js";

const facultyRouter = express.Router();

facultyRouter.use("/auth", facultyAuth);
facultyRouter.use("/view", facultyView);
facultyRouter.use("/grievance", facultyGrievance);
facultyRouter.use("/criteria", facultyCriteria);
facultyRouter.use("/assignedSub", facultySubAssigned);
facultyRouter.use("/mainSplitup", facultyMainSplitup);
facultyRouter.use("/subSplitup", facultySubSplitup);
facultyRouter.use("/marks", facultyMarks);

export default facultyRouter;
