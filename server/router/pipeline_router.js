import  express   from "express";
import { createPipeline, deletePipeline, getAllPipeline, getSinglePipeline, updatePipeline, getStagesByPipelineId, getPipelineView, createStage, updateStage, getStage, deleteStage} from "../controllers/Pipeline_controller.js";


const router = express.Router();


router.post('/create', createPipeline)
router.get('/get', getAllPipeline);
router.get('/get/:id', getSinglePipeline);
router.put('/update/:id', updatePipeline)
router.delete('/delete/:id', deletePipeline)
router.get('/get-stages/:pipeline_id', getStagesByPipelineId);
router.get('/get-pipeline-view/:pipeline_id', getPipelineView);

router.post('/create-stage/:pipeline_id', createStage);
router.put('/update-stage/:stage_id', updateStage);
router.get('/get-stage/:stage_id', getStage);
router.delete('/delete-stage/:stage_id', deleteStage)



export default router