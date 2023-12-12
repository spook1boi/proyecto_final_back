import jwt from 'jsonwebtoken';
import UsersRepository from '../repositories/User.repository.js';
import UserDTO from '../dao/DTOs/user.dto.js';
import logger from '../../src/loggers.js';

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
}

export default UserController;