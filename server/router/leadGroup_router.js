import  express   from "express";
import { createLeadGroup, deleteLeadGroup, getAllLeadGroup, getSingleLeadGroup, updateLeadGroup} from "../controllers/LeadGroup_controller.js";


const router = express.Router();


router.post('/create', createLeadGroup)
router.get('/get', getAllLeadGroup);
router.get('/get/:id', getSingleLeadGroup);
router.put('/update/:id', updateLeadGroup)
router.delete('/delete/:id', deleteLeadGroup)


export default router