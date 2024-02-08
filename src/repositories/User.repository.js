export default class UserRepository {
  constructor(dao) {
      this.dao = dao;
  }

  getUsers = async () => {
      try {
          let result = await this.dao.get();
          return result;
      } catch (error) {
          logger.error('Error in getUsers:', { error });
          throw error;
      }
  }

  createUser = async (user) => {
      try {
          let result = await this.dao.addUser(user);
          return result;
      } catch (error) {
          logger.error('Error in createUser:', { error });
          throw error;
      }
  }

  getRolUser = async (email) => {
      try {
          let result = await this.dao.getUserRoleByEmail(email);
          return result;
      } catch (error) {
          logger.error('Error in getRolUser:', { error });
          throw error;
      }
  }

  updUserRol = async ({uid, rol}) => {
      try {
          let result = await this.dao.updateUserRoleById({uid, rol});
          return result;
      } catch (error) {
          logger.error('Error in updUserRol:', { error });
          throw error;
      }
  }

  hasRequiredDocuments = async (uid) => {
      try {
      } catch (error) {
          logger.error('Error in hasRequiredDocuments:', { error });
          throw error;
      }
  }
}