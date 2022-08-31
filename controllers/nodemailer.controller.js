/*
    Nodemailer Controlleur
*/

const transporter = require("../config/nodemailer");

// Systeme d'envoie de Mail
exports.envoiMail = async (req, res) => {
    try {
        const { mail, objet, message } = req.body;
  
        // etape 3
        if (!mail || !objet || !message) return res.redirect('/')
  
        const data = await transporter.sendMail({
          from: '"Joris" <jorisbourdin.pro@gmail.com>',
          to: 'jorisbourdin.pro@gmail.com',
          subject: `Datasound + ${objet}`,
          html: `
                  <h3> Le mail du destinataire: ${mail}</h3>
                  <h3> son message : ${message}</h3>
              `
        })
  
        console.log("Email bien envoyé !!", data)
        res.redirect("back")
      } catch (error) {
        console.log(error)
        res.redirect('/')
      }
}