import { Router } from "express";
import { authMiddleware, isEditor, isYoutuber } from "../middleware/auth.middleware";
import { getEditor} from "../controller/editor.controller";
import { addEditor, info, removeEditor, stats } from "../controller/teamController";


const router = Router()



router.route('/addEditor')   .post(authMiddleware,isYoutuber,addEditor)
router.route('/removeEditor').post(authMiddleware,isYoutuber,removeEditor)


router.route('/editor/:id')  .get(authMiddleware,getEditor)
router.route('/info/:teamId').get(authMiddleware,info)

router.route('/stats').get(authMiddleware,stats)

export default router