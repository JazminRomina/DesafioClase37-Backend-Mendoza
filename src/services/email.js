import nodemailer from 'nodemailer'

export class EmailManager{
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: "jazminrominamm@gmail.com",
                pass: "qlzo lrcc przu lrij"
            }
        })
    }

    async sendEmailBuyCart(email, first_name, ticket){
        try{
            const mailOptions = {
                from: "App Coder Prueba <jazminrominamm@gmail.com>",
                to: email,
                subject: "confirmación de Compra",
                html: `
                    <h1> Recibo de compra </h1>
                    <p> Gracias por tu compra, ${first_name} </p>
                    <p> El número de orden es: ${ticket} </p>
                `
            }
            await this.transporter.sendMail(mailOptions)
        }
        catch (error){
            console.log('failed')
        }
    }

    async sendEmailResetPass(email, first_name, token){
        const mailOptions = {
            from: "App Coder Prueba <jazminrominamm@gmail.com>",
            to: email,
            subject: "Password Change",
            html: `
                <h1> Change your password </h1>
                <p> Greetings ${first_name}! </p>
                <p> You asked for a change in your password, your confirmation code is: </p>
                <strong> ${token} </strong>
                <br>
                <a href="http://localhost:8080/reset-password"> Reset your password here </a>
                <p> This code expired in 1 hour.</p>
            `
        }
        await this.transporter.sendMail(mailOptions)
        console.log("error al enviar correo de restablecimiento")
    }

}

