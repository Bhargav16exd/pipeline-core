import { Router } from "express";
import { authMiddleware, isEditor, isYoutuber } from "../middleware/auth.middleware";
import { addEditor, exit, getAllEditors, getEditor, removeEditor, search } from "../controller/editor.controller";


const router = Router()

router.route('/addEditor')   .post(authMiddleware,isYoutuber,addEditor)
router.route('/removeEditor').post(authMiddleware,isYoutuber,removeEditor)
router.route('/exit').post(authMiddleware,isEditor,exit)
router.route('/editors/:skip')     .get(authMiddleware,getAllEditors)
router.route('/editor/:id')  .get(authMiddleware,getEditor)
router.route('/search/:username')  .get(authMiddleware,search)


export default router