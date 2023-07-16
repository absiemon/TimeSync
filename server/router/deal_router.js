import  express   from "express";
import { createDeal, deleteDeal, getAllDeal, getSingleDeal, updateDeal, updateDealStage} from "../controllers/Deal_controller.js";


const router = express.Router();


router.post('/create', createDeal)
router.get('/get', getAllDeal);
router.get('/get/:id', getSingleDeal);
router.put('/update/:id', updateDeal)
router.put('/update_stageid/:id', updateDealStage)
router.delete('/delete/:id', deleteDeal)


export default router