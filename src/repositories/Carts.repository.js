import CartsMongoDAO from '../dao/mongo/carts.mongo.js';
import CartDTO from '../dao/DTOs/cart.dto.js';
import logger from '../loggers.js'; 

class CartsRepository {
  constructor() {
    this.cartsDAO = new CartsMongoDAO();
  }

  async getCarts() {
    try {
      return await this.cartsDAO.getCarts();
    } catch (error) {
      logger.error('Error in getCarts:', { error });
      throw error;
    }
  }

  async addCart(cartDTO) {
    try {
      return await this.cartsDAO.addCart(cartDTO);
    } catch (error) {
      logger.error('Error in addCart:', { error });
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      return await this.cartsDAO.getCartById(cartId);
    } catch (error) {
      logger.error('Error in getCartById:', { error });
      throw error;
    }
  }

  async removeProductFromCart(cartId, prodId) {
    try {
      return await this.cartsDAO.removeProductFromCart(cartId, prodId);
    } catch (error) {
      logger.error('Error in removeProductFromCart:', { error });
      throw error;
    }
  }

  async getCartWithProducts(cartId) {
    try {
      return await this.cartsDAO.getCartWithProducts(cartId);
    } catch (error) {
      logger.error('Error in getCartWithProducts:', { error });
      throw error;
    }
  }

  async addProductToCart(cartId, productDTO) {
    try {
      const cart = await this.cartsDAO.getCartById(cartId);

      if (!cart) {
        throw new Error('Cart not found');
      }

      const updatedCart = await this.cartsDAO.addProductToCart(cartId, productDTO);

      return updatedCart;
    } catch (error) {
      logger.error('Error in addProductToCart:', { error });
      throw error;
    }
  }

  async updateProductQuantity(cartId, prodId, quantity) {
    try {
      const cart = await this.cartsDAO.getCartById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      const updatedCart = await this.cartsDAO.updateProductQuantity(cartId, prodId, quantity);

      return updatedCart;
    } catch (error) {
      logger.error('Error in updateProductQuantity:', { error });
      throw error;
    }
  }
}

export default CartsRepository;