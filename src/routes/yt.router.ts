import { Router } from "express";
import { status, upload, uploadVideoOnYoutube } from "../controller/yt.controller";
import { authMiddleware, isYoutuber } from "../middleware/auth.middleware";

const router = Router()

/*
    ROUTE : /api/yt
    Working : Any Request to above route is redirected here
*/
router.route('/upload').post(authMiddleware,isYoutuber,uploadVideoOnYoutube)

//Server to Server call back used to recieve request from Google
router.route('/oAuth2Callback').get(upload)
router.route('/status').post(status)


export default router