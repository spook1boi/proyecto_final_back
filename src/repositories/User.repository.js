import UsersMongoDAO from '../dao/mongo/users.mongo.js';
import UserDTO from '../dao/DTOs/user.dto.js';
import logger from '../loggers.js'; 

class UsersRepository {
  constructor() {
    this.usersDAO = new UsersMongoDAO();
  }

  async getUsers() {
    try {
      return await this.usersDAO.getUsers();
    } catch (error) {
      logger.error('Error in getUsers:', { error });
      throw error;
    }
  }

  async getUserById(id) {
    try {
      return await this.usersDAO.getUserById(id);
    } catch (error) {
      logger.error('Error in getUserById:', { error });
      throw error;
    }
  }

  async addUser(userDTO) {
    try {
      return await this.usersDAO.addUser(userDTO);
    } catch (error) {
      logger.error('Error in addUser:', { error });
      throw error;
    }
  }

  async findUser(email) {
    try {
      return await this.usersDAO.findUser(email);
    } catch (error) {
      logger.error('Error in findUser:', { error });
      throw error;
    }
  }

  async findEmail(email) {
    try {
      return await this.usersDAO.findEmail(email);
    } catch (error) {
      logger.error('Error in findEmail:', { error });
      throw error;
    }
  }
}

export default UsersRepository;