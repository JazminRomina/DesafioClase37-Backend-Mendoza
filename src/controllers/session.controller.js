export class SessionsController{
    authenticateLog = async (req, res) => {
            if (!req.user) {
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

    failedLog = async (req, res) => {
        res.send("There is a problem with the page!")
    }

    gitAuthenticate = async (req, res) => {}

    gitLogAuthenticate = async (req, res) => {
            req.session.user = req.user
            req.session.login = true
            res.redirect("/profile")
        }

    logout = async(req, res) => {
        if(req.session.login){
            req.session.destroy()
        }
        res.redirect("/login")
    }
}