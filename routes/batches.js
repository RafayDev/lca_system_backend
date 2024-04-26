import auth from "../middlewares/auth";
import express from "express";
import { getBatches, getBatch, addBatch, updateBatch, deleteBatch } from "../controllers/batches.js";

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getBatches)
router.get('/:id',auth,getBatch)
router.post('/add',auth,addBatch);
router.patch('/update/:id',auth,updateBatch);
router.delete('/delete/:id',auth,deleteBatch);

export default router