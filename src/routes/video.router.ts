import { Router } from "express";
import { getApprovedVideos, getPendingVideos, initateUpload } from "../controller/video.controller";
import { authMiddleware, isEditor } from "../middleware/auth.middleware";


const router = Router()


router.route('/initiateUpload') .post(authMiddleware,isEditor,initateUpload)
router.route('/pendingVideos' ) .get(authMiddleware,getPendingVideos       )
router.route('/approvedVideos') .get(authMiddleware,getApprovedVideos      )


export default router