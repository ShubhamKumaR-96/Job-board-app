
import {Router} from 'express'
import { protect } from '../middleware/auth.middleware'
import { applyJob, jobApplication, myApplication, updateApplicationStatus } from '../controller/application.controller'

const router=Router()

router.post('/:jobId',protect,applyJob)
router.get('/my',protect,myApplication)
router.get('/jobId/:id',protect,jobApplication)
router.put('/:id',protect,updateApplicationStatus)

export default router

