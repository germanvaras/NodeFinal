const nodemailer = require("nodemailer");
const { logger } = require("../middlewares/logger");
const transportGmail = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.nodemailerEmail,
        pass: process.env.nodemailerPassword,
    },
});
const createBodyUserDeleted = (user) => {
    return `
    <!DOCTYPE html>
    <html lang="es"
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <main>
        <h1>Hola ${user.username}!</h1>
        <p>Lamentamos informarte que tu cuenta ha sido eliminada debido a la inactividad.</p>
        <p>Si tienes alguna pregunta o te gustaría reactivar tu cuenta, por favor contáctanos.</p>
        </main>
    </body>
    </html>
    `;
}
const createBodyMail = (ticket, user) => {
    return `
    <!DOCTYPE html>
<html lang="es"
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <main>
        <h1>Bienvenido a la familia Sublime ${user.name}</h1>
        <h2>Ticket de compra ${ticket.code}</h2>
        <p> El total de tu compra es: $${ticket.amount}</p>
        <p>Este email es generado automaticamente, por favor no responder al mismo!</p>
    </main>
</body>
</html>`
}
const crateBodyReset = (token, user, resetUrl) => {
    return `
    <!DOCTYPE html>
    <html lang="es"
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <main>
        <h1>Hola ${user.username}! recuperá tu contraseña ahora y volvé a disfrutar de Sublime</h1>
        <p>Este es tu token para recuperar tu contraseña: ${token}</p>
        <button> <a href ="${resetUrl}"> Recuperá tu contraseña</a></button>
        <p>Recordá que este token tiene validez durante una hora, caso contrario, tendrás que generarlo de nuevo.</p>
        </main>
    </body>
    </html>
    `
}
const createBodyProductDeletedByUser = (user, product) => {
    return `
    <!DOCTYPE html>
    <html lang="es"
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <main>
        <h1>Hola ${user.username}!</h1>
        <p>Tu producto ${product.title} ha sido eliminado exitosamente.</p>
        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
        </main>
    </body>
    </html>
    `;
}
const createBodyProductDeletedByAdmin = (user, product) => {
    return `
    <!DOCTYPE html>
    <html lang="es"
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <main>
        <h1>Hola ${user.username}!</h1>
        <p>Lamentamos informarte que tu producto ${product.title} ha sido eliminado por un administrador.</p>
        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
        </main>
    </body>
    </html>
    `;
}
const sendEmailPurchase = async (ticket, user) => {
    try {
        let result = await transportGmail.sendMail({
            from: "Sublime <tiendasublime@gmail.com> ",
            to: user.email,
            subject: `Compra ${ticket.code}`,
            html: createBodyMail(ticket, user),
            attachments: [],
        });
        return result;
    } catch (error) {
        logger.error(error.message)
    }
};
const sendEmailResetPassword = async (token, user, resetUrl) => {
    try {
        let result = await transportGmail.sendMail({
            from: "Sublime <tiendasublime@gmail.com> ",
            to: user.email,
            subject: `Recuperación de Contraseña`,
            html: crateBodyReset(token, user, resetUrl),
            attachments: [],
        });
        return result;
    } catch (error) {
        logger.error(error.message)
    }
}
const sendEmailUserDeleted = async (user) => {
    try {
        let result = await transportGmail.sendMail({
            from: "Sublime <tiendasublime@gmail.com> ",
            to: user.email,
            subject: `Tu cuenta ha sido eliminada`,
            html: createBodyUserDeleted(user),
            attachments: [],
        });
        return result;
    } catch (error) {
        logger.error(error.message)
    }
}
const sendEmailProductDeleted = async (user, emailBody) => {
    try {
        let result = await transportGmail.sendMail({
            from: "Sublime <tiendasublime@gmail.com> ",
            to: user,
            subject: `Tu producto ha sido eliminado`,
            html: emailBody,
            attachments: [],
        });
        return result;
    } catch (error) {
        logger.error(error.message)
    }
}
module.exports = { sendEmailPurchase, sendEmailResetPassword, sendEmailUserDeleted, sendEmailProductDeleted, createBodyProductDeletedByAdmin, createBodyProductDeletedByUser }