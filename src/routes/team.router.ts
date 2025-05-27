import { Router } from "express";
import { authMiddleware, isYoutuber } from "../middleware/auth.middleware";
import { addEditor, getAllEditors, getEditor, removeEditor } from "../controller/editor.controller";


const router = Router()

router.route('/addEditor')   .post(authMiddleware,isYoutuber,addEditor)
router.route('/removeEditor').post(authMiddleware,isYoutuber,removeEditor)
router.route('/editors')     .get(authMiddleware,getAllEditors)
router.route('/editor/:id')  .get(authMiddleware,getEditor)

export default router