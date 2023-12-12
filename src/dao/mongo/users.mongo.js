import { usersModel } from './models/users.model.js';
import mongoose from "mongoose";
import UserDTO from '../DTOs/user.dto.js';
import logger from '../../loggers.js'; 

class UsersMongoDAO {
  async getUsers() {
    try {
      return await usersModel.find({});
    } catch (error) {
      logger.error('Error while fetching users:', { error });
      return [];
    }
  }

  async getUserById(id) {
    try {
      const user = await usersModel.findById(id).lean();
      if (!user) {
        return null;
      }
      return new UserDTO(user);
    } catch (error) {
      logger.error('Error while fetching the user:', { error });
      throw new Error('Error while fetching the user');
    }
  }

  async addUser(userDTO) {
    try {
      const user = new usersModel(userDTO);
      const savedUser = await user.save();
      return new UserDTO(savedUser);
    } catch (error) {
      logger.error('Error while adding the user:', { error });
      throw new Error('Error while adding the user');
    }
  }

  async findUser(email) {
    try {
      const user = await usersModel.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, rol: 1 }).lean();
      return user ? new UserDTO(user) : null;
    } catch (error) {
      logger.error('Error while validating the user', { error });
      throw new Error('Error while validating the user');
    }
  }

  async findEmail(email) {
    try {
      const user = await usersModel.findOne({ email }).lean();
      return user ? new UserDTO(user) : null;
    } catch (error) {
      logger.error('Error while validating the user', { error });
      throw new Error('Error while validating the user');
    }
  }
}

export default UsersMongoDAO;