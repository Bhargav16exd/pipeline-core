import { Router } from "express";
import { authMiddleware, isEditor, isYoutuber } from "../middleware/auth.middleware";
import { exit, getAllEditors, getEditor, search } from "../controller/editor.controller";
import { addEditor, info, removeEditor, stats } from "../controller/teamController";


const router = Router()

router.route('/addEditor')   .post(authMiddleware,isYoutuber,addEditor)
router.route('/removeEditor').post(authMiddleware,isYoutuber,removeEditor)

router.route('/exit').post(authMiddleware,isEditor,exit)
router.route('/editors/:skip')     .get(authMiddleware,getAllEditors)
router.route('/editor/:id')  .get(authMiddleware,getEditor)
router.route('/search/:username')  .get(authMiddleware,search)
router.route('/info/:teamId').get(authMiddleware,info)

router.route('/stats').get(authMiddleware,stats)

export default router