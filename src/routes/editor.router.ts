import { Router } from "express";
import { changePassword, exit, getEditor, signup, update } from "../controller/editor.controller";
import { authMiddleware, isEditor } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";
import { VerifyInviteCode } from "../middleware/invitecode.middleware";
import checkEmailVerified from "../middleware/verification.middleware";


const router = Router()

/*
    ROUTE : /api/editor
    Working : Any Request to above route is redirected here
*/

router.route('/signup').post(upload.single('profile'),checkEmailVerified,VerifyInviteCode,signup)

//Authorized Routes 
router.route('/:id').get(authMiddleware,getEditor)


router.route('/changePassword').post(authMiddleware,isEditor,changePassword)
router.route('/update').patch(authMiddleware,isEditor,upload.single('profile'),update)

export default router