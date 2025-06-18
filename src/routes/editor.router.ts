import { Router } from "express";
import { changePassword, exit, getAllEditors, getEditor, search, signup } from "../controller/editor.controller";
import { authMiddleware, isEditor } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";


const router = Router()


router.route('/signup').post(upload.single('profile'),signup)

router.route('/exit').post(authMiddleware,isEditor,exit)
router.route('/:skip')     .get(authMiddleware,getAllEditors)
router.route('/:id')  .get(authMiddleware,getEditor)
router.route('/search/:username')  .get(authMiddleware,search)


router.route('/changePassword').post(authMiddleware,isEditor,changePassword)


export default router