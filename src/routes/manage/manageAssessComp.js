import { Router } from "express";
import {
  createAssessComp,
  deleteAssessComp,
  getAllAssessComps,
  getAssessCompById,
  getAssessCompByRegulation,
  updateAssessComp,
} from "../../controllers/manage/manageAssessComp.js";

const assessCompRouter = Router();

assessCompRouter.get("/", getAllAssessComps);
assessCompRouter.get("/:id", getAssessCompById);
assessCompRouter.post("/", createAssessComp);
assessCompRouter.put("/:id", updateAssessComp);
assessCompRouter.delete("/:id", deleteAssessComp);
assessCompRouter.get("/regulation/:regulation", getAssessCompByRegulation);

export default assessCompRouter;
