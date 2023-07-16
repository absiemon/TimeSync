import  express   from "express";
import { createEmployeeLeave, deletFTPfile, deleteEmployeeLeave, getAllEmployeeLeave, getSingleEmployeeLeave, updateEmployeeLeave, updateEmployeeLeaveStatus, uploadFiles, getEmployeeLeaveByEmpId } from "../controllers/EmployeeLeave_controller.js";
import multer  from 'multer';
import fs from 'fs'

const router = express.Router();

// const uploadDir = 'tmp/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }
const upload = multer({ dest: '/tmp' });

router.post('/create', createEmployeeLeave)
router.get('/get', getAllEmployeeLeave);
router.get('/get/:id', getSingleEmployeeLeave);
router.get('/get-leave/:emp_id', getEmployeeLeaveByEmpId);
router.put('/update/:id', updateEmployeeLeave)
router.post('/update-leave-request', updateEmployeeLeaveStatus)
router.delete('/delete-employee-leave/:id', deleteEmployeeLeave)
router.post('/upload-files',  upload.array('files', 100), uploadFiles)
router.delete('/delete-ftp-file/:fname', deletFTPfile)

export default router