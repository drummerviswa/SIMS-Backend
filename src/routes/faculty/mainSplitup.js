import { Router } from "express";
import {
  addMainSplitup,
  deleteMainSplitup,
  getAllMainSplitup,
  getMainSplitup,
  updateMainSplitup,
} from "../../controllers/faculty/mainSplitup.js";

const mainSplitupRouter = Router({ mergeParams: true });

mainSplitupRouter.get("/:faculty/:subject", getMainSplitup);
mainSplitupRouter.post("/:faculty/:subject", addMainSplitup);
mainSplitupRouter.put("/:faculty/:subject/:id", updateMainSplitup);
mainSplitupRouter.delete("/:faculty/:subject/:id", deleteMainSplitup);
mainSplitupRouter.get("/all/:faculty", getAllMainSplitup);
mainSplitupRouter.get("/all", getAllMainSplitup);

export default mainSplitupRouter;