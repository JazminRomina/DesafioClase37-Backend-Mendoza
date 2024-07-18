import productsModel from '../models/products.model.js'
import { ProductService } from '../services/products.service.js'
import { CartService } from '../services/carts.service.js'
import DTOuser from '../DTO/user.dto.js'

export class ViewsController{
    allProdsRender = async(req, res) => {
    const allProds = await ProductService.getAllProdsViews(req)
    res.render("home", {
        prods: allProds.response.payload,
        hasPrevPage: allProds.response.hasPrevPage,
        hasNextPage: allProds.response.hasNextPage,
        prevPage: allProds.response.prevPage,
        nextPage: allProds.response.nextPage,
        currentPage: allProds.response.page,
        totalPages: allProds.response.totalPages
    })
    }

    realTimeProds = async(req, res) => {
        const allProds = await productsModel.find().lean()
        res.render("realTimeProducts", {prods: allProds})
    }

    chat = async (req, res) => {
        res.render("chat")
    }

    getProdsForView = async (req, res) => {
        const allProds = await ProductService.getAllProdsViews(req)
        res.render("products", {
            prods: allProds.response.payload,
            hasPrevPage: allProds.response.hasPrevPage,
            hasNextPage: allProds.response.hasNextPage,
            prevPage: allProds.response.prevPage,
            nextPage: allProds.response.nextPage,
            currentPage: allProds.response.page,
            totalPages: allProds.response.totalPages,
            user: req.session.user,
            session: req.session.login
        })
    }

    cartRender = async (req, res) => {
        try{
            const cid = req.params.cid
            const cartProdsInIt = await CartService.getCartById(cid)
            let totalPrice = 0
            const cartsTotalPrice = cartProdsInIt.products.map((p) => {
                const prod = p.product
                const quantity = p.quantity
                const finalPrice = prod.price * quantity
                totalPrice += finalPrice

                return {
                    ...p,
                    finalPrice: finalPrice
                }
            })
            res.render("carts", {
                productsCart: cartsTotalPrice,
                cartId: cartProdsInIt._id,
                finalTotalPrice: totalPrice
            })
        }
        catch(error){
            res.status(500).json('We could not find the cart')
        }
    }

    login = (req, res) => {
        res.render("login")
    }

    register = (req, res) => {
        res.render("register")
    }

    profile = async(req, res) => {
        if(!req.session.login){
            return res.redirect("/login")
        }
        res.render("profile", {user: new DTOuser(req.session.user)})
    }

    logger = async(req, res) => {
        req.logger.fatal("Mensaje FATAL")
        req.logger.error("Mensaje ERROR")
        req.logger.warning("Mensaje WARNING")
        req.logger.info("Mensaje INFO")
        req.logger.http("Mensaje HTTP")
        req.logger.debug("Mensaje DEBUG")

        res.send("Test de Logs")
    }
}