import { Router } from "express";
import { upload, uploadVideoOnYoutube } from "../controller/yt.controller";
import { authMiddleware, isYoutuber } from "../middleware/auth.middleware";




const router = Router()

router.route('/upload').post(authMiddleware,isYoutuber,uploadVideoOnYoutube)
router.route('/oAuth2Callback').get(upload)



export default router