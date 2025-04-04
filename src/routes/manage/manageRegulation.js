import { Router } from "express";
import {
  addRegulation,
  deleteRegulation,
  getAllRegulations,
  getRegulationById,
  updateRegulation,
} from "../../controllers/manage/manageRegulation.js";

const router = Router();

router.get("/", getAllRegulations);
router.get("/:rid", getRegulationById);
router.post("/", addRegulation);
router.put("/:rid", updateRegulation);
router.delete("/:rid", deleteRegulation);

export default router;
