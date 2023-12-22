import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import logger from '../loggers.js';

class PasswordResetController {
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const token = jwt.sign({ email }, 'secret_key', { expiresIn: '1h' });
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; 
      await user.save();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ed.zuleta_@live.cl', 
          pass: 'password123',       
        },
      });
      
      const resetLink = `http://tu-sitio.com/reset-password/${token}`;
      const mailOptions = {
        to: user.email,
        subject: 'Restablecimiento de Contraseña',
        text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          logger.error('Error enviando correo de restablecimiento:', { error });
          return res.status(500).json({ message: 'Error enviando correo de restablecimiento' });
        }
        res.status(200).json({ message: 'Correo de restablecimiento enviado con éxito' });
      });
    } catch (error) {
      logger.error('Error al solicitar restablecimiento de contraseña:', { error });
      res.status(500).json({ message: 'Error al solicitar restablecimiento de contraseña' });
    }
  }
}

export default PasswordResetController;