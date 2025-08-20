import { Router } from "express";
import {  getInitiatedVideos, getPendingVideos, initateUpload, updateUploadStatus } from "../controller/video.controller";
import { authMiddleware, isEditor } from "../middleware/auth.middleware";


const router = Router()

/*
    ROUTE : /api/video
    Working : Any Request to above route is redirected here
*/

//Allow only Editor
router.route('/upload') .post(authMiddleware,isEditor,initateUpload)

//Allow all authorized uses
router.route('/pending' ) .get(authMiddleware,getPendingVideos       )
router.route('/init') .get(authMiddleware,getInitiatedVideos      )

router.route('/status').post(updateUploadStatus)

export default router