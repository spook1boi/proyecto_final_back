import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const consoleTransport = new winston.transports.Console();
const fileTransport = new winston.transports.File({ filename: 'combined.log' });

const winstonLogger = winston.createLogger({
  transports: [consoleTransport, fileTransport],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

const logger = {
  info: (message, metadata) => winstonLogger.info(message, metadata),
  error: (message, metadata) => winstonLogger.error(message, metadata)
};

export const createHash = async (password) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    logger.error("Error al crear el hash de la contraseña: ", { error });
    throw error;
  }
};

export const isValidPassword = (user, password) => {
  logger.info("Comparando contraseñas:", { user, password });

  if (!user || !user.password || !password) {
    logger.info("Faltan datos de usuario o contraseña.");
    return false;
  }

  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', {
      expiresIn: '1h',
    });
    return token;
  } catch (error) {
    logger.error("Error al generar el token: ", { error });
    throw error;
  }
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    return decoded;
  } catch (error) {
    logger.error("Error al verificar el token: ", { error });
    throw error;
  }
};

export const transport = async (options) => {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    logger.error("Error al enviar correo electrónico: ", { error });
    throw error;
  }
};

export const authorization= (role) => {
  return async(req, res, next)=>{
      if(!req.user) return res.status(401).send({error: "Unauthorized"})
      if(req.user.role!= role) return res.status(403).send({error:"No permissions"})
      next()
  }
}

export const passportCall = (strategy) => {
  return async(req, res, next)=>{
      passport.authenticate(strategy, function(err, user, info){
          if(err) return next(err)
          if(!user){
              return res.status(401).send({error:info.messages?info.messages:info.toString()})
          }
          req.user = user
          next()
      })(req, res, next)
  }
}

export default __dirname;