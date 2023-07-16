import  express   from "express";
import { createEmployeeDesignation, deleteEmployeeDesignation, getAllEmployeeDesignation, getSingleEmployeeDesignation, updateEmployeeDesignation} from "../controllers/Designation_controller.js";


const router = express.Router();

router.post('/create', createEmployeeDesignation)
router.get('/get', getAllEmployeeDesignation);
router.get('/get/:id', getSingleEmployeeDesignation);
router.put('/update/:id', updateEmployeeDesignation)
router.delete('/delete/:id', deleteEmployeeDesignation)


export default router