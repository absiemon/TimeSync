import  express   from "express";
import { createOrganization, deleteOrganization, getAllOrganization, getSingleOrganization, updateOrganization} from "../controllers/Organization_controller.js";


const router = express.Router();


router.post('/create', createOrganization)
router.get('/get', getAllOrganization);
router.get('/get/:id', getSingleOrganization);
router.put('/update/:id', updateOrganization)
router.delete('/delete/:id', deleteOrganization)


export default router