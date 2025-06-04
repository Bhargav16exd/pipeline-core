import { Router } from "express";
import { status, upload, uploadVideoOnYoutube } from "../controller/yt.controller";
import { authMiddleware, isYoutuber } from "../middleware/auth.middleware";




const router = Router()

router.route('/upload').post(authMiddleware,isYoutuber,uploadVideoOnYoutube)
router.route('/oAuth2Callback').get(upload)

router.route('/status').post(status)


export default router