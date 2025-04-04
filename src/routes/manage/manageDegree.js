import express from "express";
import {
  getAllDegrees,
  addDegree,
  updateDegree,
  deleteDegree,
  getDegreeByDepartment,
  getDegreeByDuration,
  getDegreeById,
} from "../../controllers/manage/manageDegree.js";

const manageDegreeRouter = express.Router();

manageDegreeRouter.get("/", getAllDegrees);
manageDegreeRouter.post("/", addDegree);
manageDegreeRouter.put("/:id", updateDegree);
manageDegreeRouter.delete("/:id", deleteDegree);
manageDegreeRouter.get("/:id",getDegreeById)
manageDegreeRouter.get("/department/:department", getDegreeByDepartment);
manageDegreeRouter.get("/duration/:duration", getDegreeByDuration);

export default manageDegreeRouter;
