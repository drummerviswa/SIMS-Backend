import { Router } from "express";

const adminManage = Router();
adminManage.get("/", (req, res) => {
  res.send("Manage Admin Route");
});
adminManage.get();