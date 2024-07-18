import express from 'express'
import passport from 'passport'
import { UsersController } from '../controllers/users.controller.js'

const userController = new UsersController()
const router = express.Router()

router.post("/", passport.authenticate("register", {failureRedirect: "/failedregister"}), userController.registerAuthenticate)
router.get("/failedregister", userController.failedRegister)

export default router