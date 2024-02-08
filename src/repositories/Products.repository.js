export default class ProductRepository {
  constructor(dao) {
      this.dao = dao;
  }

  getProducts = async () => {
      try {
          let result = await this.dao.get();
          return result;
      } catch (error) {
          logger.error('Error in getProducts:', { error });
          throw error;
      }
  }

  createProduct = async (product) => {
      try {
          let result = await this.dao.create(product);
          return result;
      } catch (error) {
          logger.error('Error in createProduct:', { error });
          throw error;
      }
  }
}