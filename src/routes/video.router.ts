import { Router } from "express";
import { getApprovedVideos, getPendingVideos, initateUpload, updateUploadStatus } from "../controller/video.controller";
import { authMiddleware, isEditor } from "../middleware/auth.middleware";


const router = Router()


router.route('/upload') .post(authMiddleware,isEditor,initateUpload)
router.route('/pending' ) .get(authMiddleware,getPendingVideos       )
router.route('/approved') .get(authMiddleware,getApprovedVideos      )

//Add Authentication When in Production 
router.route('/status').post(authMiddleware,updateUploadStatus)

export default router