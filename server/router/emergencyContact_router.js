import  express   from "express";
import { createEmergencyContact, deleteEmergencyContact, getAllEmergencyContact, getSingleEmergencyContact, updateEmergencyContact } from "../controllers/EmergencyContact_controller.js";

const router = express.Router();

router.post('/create', createEmergencyContact)
router.get('/get/:emp_id', getAllEmergencyContact);
router.get('/get-single/:id', getSingleEmergencyContact);
router.put('/update/:id', updateEmergencyContact)
router.delete('/delete/:id', deleteEmergencyContact)


export default router