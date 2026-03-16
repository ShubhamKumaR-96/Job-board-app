import { Router } from "express";
import { createJob, deleteJobById, getAllJobs, getJobById, updateJob } from "../controller/job.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router()

router.post('/',protect,createJob)
router.get('/',getAllJobs)
router.get('/:id',getJobById)
router.put('/:id',protect,updateJob)
router.delete('/:id',protect,deleteJobById)
export default router;