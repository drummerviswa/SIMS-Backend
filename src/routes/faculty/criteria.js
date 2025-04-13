import { Router } from "express";

const criteriaRouter = Router({
    mergeParams: true,
});

import {
  addCriteria,
  updateCriteria,
  deleteCriteria,
  getCriteriaById,
  getAllCriteria,
} from "../../controllers/faculty/criteria.js";

criteriaRouter.get("/", getAllCriteria);
criteriaRouter.post("/", addCriteria);
criteriaRouter.put("/", updateCriteria);
criteriaRouter.delete("/:cid", deleteCriteria);
criteriaRouter.get("/:cid", getCriteriaById);

export default criteriaRouter;