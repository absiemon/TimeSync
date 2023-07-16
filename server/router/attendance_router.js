import  express   from "express";
import { createEmployeeAttendance, deleteEmployeeAttendance, getAllEmployeeAttendance, getSingleEmployeeAttendance, updateEmployeeAttendance, todayAttendance, getSingleEmployeeAttendanceByEmpId, getIp} from "../controllers/EmployeeAttendance_controller.js";


const router = express.Router();


router.post('/create-employee-attendance', createEmployeeAttendance)
router.get('/get-employee-attendance', getAllEmployeeAttendance);
router.get('/get-single-employee-attendance/:id', getSingleEmployeeAttendance);
router.get('/get-employee-attendance/:emp_id', getSingleEmployeeAttendanceByEmpId);
router.put('/update-employee-attendance/:id', updateEmployeeAttendance)
router.delete('/delete-employee-attendance/:id', deleteEmployeeAttendance)
router.get('/get-today_attendance/:id', todayAttendance)

router.get('/get-ip', getIp)


export default router