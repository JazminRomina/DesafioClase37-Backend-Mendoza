import { generateToken } from "../utils/tokenreset.js"
import { EmailManager } from "../services/email.js"
import usersModel from "../models/users.model.js"
import { createHash, isValidPassword } from "../utils/hashbcrypt.js"

const emailManager = new EmailManager()

export class UsersController{
    registerAuthenticate = async(req, res) => {
        if(!req.user){
            return res.status(400).send("Invalid credentials")
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol,
            cart: req.user.cart
        }
        req.session.login = true
        res.redirect("/profile")
    }

    failedRegister = (req, res) => {
        res.send("There is a problem with the page!")
    }

    requestPasswordReset = async(req, res) => {
        const {email} = req.body
        try{
            const user = await usersModel.findOne({email})
            if(!user){
                return res.status(404).send("User not found")
            }
            const token = generateToken()
            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 3600000)
            }
            await user.save()
            await emailManager.sendEmailResetPass(email, user.first_name, token)
            res.render("confirmacion-envio")
        }
        catch(error){
            res.status(500).send("Error in the server.")
        }
    }

    resetPassword = async(req, res) => {
        const {email, password, token} = req.body
        try{
            const user = await usersModel.findOne({email})
            if(!user){
                return res.render("resetpass", {error: "user not found."})
            }
            const resetToken = user.resetToken
            if(!resetToken || resetToken.token !== token){
                return res.render("getemailpass", {error: "The token is invalid."})
            }
            const fecha = new Date()
            if(fecha > resetToken.expire){
                return res.render("getemailpass", {error: "The token has expired."})
            }
            if(isValidPassword(password, user)){
                return res.render("resetpass", {error: "The new password cannot be the same as the old one."})
            }

            user.password = createHash(password)
            user.resetToken = undefined
            await user.save()

            return res.redirect("/login")
        }
        catch(error){
            res.status(500).send("Error in the server.")
        }
    }

    changeRolPremium = async(req, res) => {
        const {uid} = req.params
        try {
            const user = await usersModel.findById(uid)
            if(!user) {
                return res.status(404).send("User not found")
            }
            const newRol = user.rol === "User" ? "Premium" : "User"
            const updateRol = await usersModel.findByIdAndUpdate(uid, {rol: newRol})
            res.json(updateRol)
        } catch (error) {
            res.status(500).send("There is an error in the server.")
        }
    }
}