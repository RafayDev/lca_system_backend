import express from "express";
import { getBatches, getBatch, addBatch, updateBatch, deleteBatch } from "../controllers/batches.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

//make routes with auth middle ware
router.get('/',auth,getBatches)
router.get('/:id',auth,getBatch)
router.post('/add',auth,addBatch);
router.post('/update/:id',auth,updateBatch);
router.delete('/delete/:id',auth,deleteBatch);

export default router