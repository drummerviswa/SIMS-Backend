import { Router } from "express";
import viewSubjectByFaculty from "./viewSubjectByFaculty.js";
import viewBatchesByFaculty from "./viewBatchByFaculty.js";

const viewsFacultyRouter = Router();

viewsFacultyRouter.use("/:facId/subject", viewSubjectByFaculty);
viewsFacultyRouter.use("/:facId/batches", viewBatchesByFaculty);

export default viewsFacultyRouter;
