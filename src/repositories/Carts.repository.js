export default class CartRepository {
  constructor(dao) {
      this.dao = dao;
  }

  getCarts = async () => {
      try {
          let result = await this.dao.get();
          return result;
      } catch (error) {
          logger.error('Error in getCarts:', { error });
          throw error;
      }
  }

  createCart = async (cart) => {
      try {
          let result = await this.dao.create(cart);
          return result;
      } catch (error) {
          logger.error('Error in createCart:', { error });
          throw error;
      }
  }

  addToCart = async (cartId, productId, quantity) => {
    try {
        let result = await this.dao.addToCart(cartId, productId, quantity);
        return result;
    } catch (error) {
        logger.error('Error in addToCart:', { error });
        throw error;
    }
}

  validateCart = async (cartId) => {
      try {
          let result = await this.dao.validateCart(cartId);
          return result;
      } catch (error) {
          logger.error('Error in validateCart:', { error });
          throw error;
      }
  }

  validateStock = async (products) => {
      try {
          let result = await this.dao.validateStock(products);
          return result;
      } catch (error) {
          logger.error('Error in validateStock:', { error });
          throw error;
      }
  }

  getAmount = async (products) => {
      try {
          let result = await this.dao.getAmount(products);
          return result;
      } catch (error) {
          logger.error('Error in getAmount:', { error });
          throw error;
      }
  }
}