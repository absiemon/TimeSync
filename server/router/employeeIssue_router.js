import  express   from "express";
import { createEmployeeIssue, deleteEmployeeIssue, getAllEmployeeIssue, getEmployeeIssueById, getSingleEmployeeIssue, updateEmployeeIssue } from "../controllers/EmployeeIssue_controller.js";
const router = express.Router();

router.post('/create-employee-issue', createEmployeeIssue)
router.get('/get-employee-issue', getAllEmployeeIssue);
router.get('/get-employee-issue/:emp_id', getEmployeeIssueById);
router.get('/get-single-employee-issue/:id', getSingleEmployeeIssue);
router.put('/update-employee-issue/:id', updateEmployeeIssue)
router.delete('/delete-employee-issue/:id', deleteEmployeeIssue)

export default router