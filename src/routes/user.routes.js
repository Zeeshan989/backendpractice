import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { loginUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import {logoutUser} from "../controllers/user.controller.js"
import {refreshToken} from "../controllers/user.controller.js"
import {Updatepassword} from "../controllers/user.controller.js"
import { UpdateAvatar } from "../controllers/user.controller.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1,
        },{
            name:"coverImage",
            maxCount:1,
        }
    ]),
    registerUser);

router.route('/login').post(
    loginUser
)

router.route('/logout').post(verifyJWT,logoutUser)
router.route('/refreshtoken').post(verifyJWT,refreshToken)
router.route('/updatepassword').post(verifyJWT,Updatepassword)
router.route('/updateavatar').post(verifyJWT,
    upload.single('newavatar'),
    UpdateAvatar)


export default router
