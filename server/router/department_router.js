import  express   from "express";
import { createEmployeeDepartment, deleteEmployeeDepartment, getAllEmployeeDepartment, getSingleEmployeeDepartment, updateEmployeeDepartment} from "../controllers/Department_controller.js";


const router = express.Router();

router.post('/create', createEmployeeDepartment)
router.get('/get', getAllEmployeeDepartment);
router.get('/get/:id', getSingleEmployeeDepartment);
router.put('/update/:id', updateEmployeeDepartment)
router.delete('/delete/:id', deleteEmployeeDepartment)


export default router