import jwt from 'jsonwebtoken';
import logger from '../loggers.js';

export function generateAndSetToken(res, email, password) {
  try {
    const token = jwt.sign({ email, password, role: "user" }, "Secret-key", { expiresIn: "24h" });
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    return token;
  } catch (error) {
    logger.error('Error al generar y establecer el token:', error);
    throw error;
  }
}

export function getEmailFromTokenLogin(token) {
  try {
    const decoded = jwt.verify(token, 'Secret-key');
    return decoded.email;
  } catch (error) {
    logger.error('Error al decodificar el token:', error);
    return null; 
  }
}

export function generateAndSetTokenEmail(email) {
  try {
    const token = jwt.sign({ email }, 'secreto', { expiresIn: '1h' });
    return token;
  } catch (error) {
    logger.error('Error al generar y establecer el token de email:', error);
    throw error;
  }
}

export function getEmailFromToken(token) {
  try {
    const decoded = jwt.verify(token, 'secreto');
    const email = decoded.email;
    return email;
  } catch (error) {
    logger.error('Error al decodificar el token:', error);
    return null;
  }
}

export function validateTokenResetPass(token) {
  try {
    const result = jwt.verify(token, 'secreto');
    return result;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.error('El token ha expirado');
      return null; 
    } else {
      logger.error('Error al verificar el token:', error);
      return null; 
    }
  }
}