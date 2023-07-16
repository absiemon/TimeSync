import  express   from "express";
import { createPersons, deletePersons, getAllPersons, getSinglePersons, updatePersons} from "../controllers/Persons_controller.js";


const router = express.Router();


router.post('/create', createPersons)
router.get('/get', getAllPersons);
router.get('/get/:id', getSinglePersons);
router.put('/update/:id', updatePersons)
router.delete('/delete/:id', deletePersons)


export default router