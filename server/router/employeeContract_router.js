import  express   from "express";
import { createEmployeeContract, deletFTPfile, deleteEmployeeContract, getAllEmployeeContract, getSingleEmployeeContract, updateEmployeeContract, uploadFiles, getEmployeeContractById } from "../controllers/EmployeeContract_controller.js";
import multer  from 'multer';
import fs from 'fs'

const router = express.Router();

// const uploadDir = 'tmp/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }
const upload = multer({ dest: '/tmp' });

router.post('/create-employee-contract', createEmployeeContract)
router.get('/get-employee-contract', getAllEmployeeContract);
router.get('/get-employee-contract/:emp_id', getEmployeeContractById);
router.get('/get-single-employee-contract/:id', getSingleEmployeeContract);
router.put('/update-employee-contract/:id', updateEmployeeContract)
router.delete('/delete-employee-contract/:id', deleteEmployeeContract)
router.post('/upload-files',  upload.array('files', 100), uploadFiles)
router.delete('/delete-ftp-file/:fname', deletFTPfile)

export default router