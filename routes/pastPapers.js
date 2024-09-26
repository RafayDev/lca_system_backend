import express from "express"
import { getAllPastPapers, getPastPaperById, createPastPaper, updatePastPaper, deletePastPaper, getPastPaperByCourseAndYear} from "../controllers/pastPapers.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get('/',getAllPastPapers)
router.get('/:id',getPastPaperById)
router.post('/add',createPastPaper)
router.post('/update/:id',auth,updatePastPaper)
router.delete('/delete/:id',deletePastPaper)
router.post('/pastPapers/papers',getPastPaperByCourseAndYear)

export default router