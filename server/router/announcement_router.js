import  express   from "express";
import { createAnnouncement, deleteAnnouncement, getAllAnnouncement, getSingleAnnouncement, updateAnnouncement, getEmployeeAnnouncement} from "../controllers/Announcement_controller.js";


const router = express.Router();

router.post('/create', createAnnouncement)
router.get('/get', getAllAnnouncement);
router.get('/get/:id', getSingleAnnouncement);
router.get('/get-announcement/:id', getEmployeeAnnouncement);
router.put('/update/:id', updateAnnouncement)
router.delete('/delete/:id', deleteAnnouncement)


export default router