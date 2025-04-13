import { Router } from "express";
import {
  addSubSplitup,
  deleteSubSplitup,
  getSubSplitup,
  getSubSplitupByTenure,
  updateSubSplitup,
} from "../../controllers/faculty/subSplitup.js";

const subSplitupRouter = Router({
  mergeParams: true,
});

subSplitupRouter.get("/:faculty/:subject/:msid", getSubSplitup);
subSplitupRouter.post("/:faculty/:subject", addSubSplitup);
subSplitupRouter.put("/:faculty/:subject/:id", updateSubSplitup);
subSplitupRouter.delete("/:faculty/:subject/:id", deleteSubSplitup);
subSplitupRouter.get("/:faculty/:subject/:msid/:tenure", getSubSplitupByTenure);

export default subSplitupRouter;
