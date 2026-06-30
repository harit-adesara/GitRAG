import { Router } from "express";
import { sendMsg, chatData } from "../controllers/message.js";
import {
  createRepo,
  getRepos,
  createChat,
  getChats,
  reclone,
  deleteRepo,
} from "../controllers/repo.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

import {
  loginJWT,
  logOut,
  registerUser,
  verifyEmail,
  getCurrentUser,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgetPassword,
  changePassword,
  resendRegisterMail,
  addPassword,
} from "../controllers/auth.js";

// auth routes

router.route("/login").post(loginJWT); // done

router.route("/forgot-password").post(forgotPasswordRequest); // done

router.route("/reset-password/:resetToken").post(resetForgetPassword); // done

router.route("/resend-register-email").post(resendRegisterMail); // done

router.route("/register").post(registerUser); // done

router.route("/refresh-token").post(refreshAccessToken); // done

router.route("/me").get(verifyJWT, getCurrentUser); //done

router.route("/logout").post(verifyJWT, logOut); //done

router.route("/change-password").post(changePassword); // done

router.route(`/verify/:verificationToken`).get(verifyEmail); // done

router.route("/oath-set-password").post(verifyJWT, addPassword);

router.route("/send-msg").post(verifyJWT, sendMsg); // done

router.route("/chat-data").get(verifyJWT, chatData); // done

router.route("/create-repo").post(verifyJWT, createRepo); // done

router.route("/get-repos").get(verifyJWT, getRepos); // done

router.route("/create-chat").post(verifyJWT, createChat); // done

router.route("/get-chats").get(verifyJWT, getChats); // done

router.route("/pull-repo").get(verifyJWT, reclone); // done

router.route("/delete-repo").delete(verifyJWT, deleteRepo);

export { router };
