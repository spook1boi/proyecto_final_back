import jwt from 'jsonwebtoken';
import UsersRepository from '../repositories/User.repository.js';
import logger from '../loggers.js';
import nodemailer from 'nodemailer';
import UserDTO from '../dao/DTOs/user.dto.js';

class UserController {
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async getUsers() {
    try {
      return await this.usersRepository.getUsers();
    } catch (error) {
      logger.error('Error while fetching users:', { error });
      return [];
    }
  }

  async getUserById(id) {
    try {
      return await this.usersRepository.getUserById(id);
    } catch (error) {
      logger.error('Error while fetching the user:', { error });
      return 'Error while fetching the user';
    }
  }

  async register(userData) {
    try {
      const userDTO = new UserDTO(userData);
      const newUser = await this.usersRepository.addUser(userDTO);
      return newUser;
    } catch (error) {
      logger.error('Error while registering:', { error });
      throw new Error('Error while registering');
    }
  }

  async findUser(email) {
    try {
      return await this.usersRepository.findUser(email);
    } catch (error) {
      logger.error('Error while validating the user', { error });
      throw new Error('Error while validating the user');
    }
  }

  async findEmail(email) {
    try {
      return await this.usersRepository.findEmail(email);
    } catch (error) {
      logger.error('Error while validating the user', { error });
      throw new Error('Error while validating the user');
    }
  }

  async generateToken(user) {
    try {
      const token = jwt.sign({ email: user.email, rol: user.rol }, 'secret_key', { expiresIn: '1h' });
      return token;
    } catch (error) {
      logger.error('Error while generating token:', { error });
      throw new Error('Error while generating token');
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, 'secret_key');
      return decoded;
    } catch (error) {
      logger.error('Error while verifying token:', { error });
      throw new Error('Error while verifying token');
    }
  }

  async changeUserRole(userId, newRole) {
    try {
      const updatedUser = await this.usersRepository.changeUserRole(userId, newRole);
      return updatedUser;
    } catch (error) {
      logger.error('Error while changing user role:', { error });
      throw new Error('Error while changing user role');
    }
  }

  async uploadDocuments(userId, documents) {
    try {
      const updatedUser = await this.usersRepository.uploadDocuments(userId, documents);
      return updatedUser;
    } catch (error) {
      logger.error('Error while uploading documents:', { error });
      throw new Error('Error while uploading documents');
    }
  }

  async updateLastConnection(userId) {
    try {
      const updatedUser = await this.usersRepository.updateLastConnection(userId);
      return updatedUser;
    } catch (error) {
      logger.error('Error while updating last connection:', { error });
      throw new Error('Error while updating last connection');
    }
  }
}

export default UserController;