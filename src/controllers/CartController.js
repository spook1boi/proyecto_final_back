import CartsRepository from '../repositories/Carts.repository.js';
import logger from '../loggers.js';

class CartController {
  constructor() {
    this.cartsRepository = new CartsRepository();
  }

  async getCarts() {
    try {
      const carts = await this.cartsRepository.getCarts();
      logger.info('Carts fetched successfully:', { carts });
      return carts;
    } catch (error) {
      logger.error('Error fetching carts:', { error });
      throw error;
    }
  }

  async addCart(cartDTO) {
    try {
      await this.cartsRepository.addCart(cartDTO);
      logger.info('Cart added successfully:', { cartDTO });
    } catch (error) {
      logger.error('Error adding cart:', { error });
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await this.cartsRepository.getCartById(cartId);
      logger.info('Cart fetched by ID successfully:', { cart });
      return cart;
    } catch (error) {
      logger.error('Error getting cart by ID:', { error });
      throw error;
    }
  }

  async removeProductFromCart(cartId, prodId) {
    try {
      await this.cartsRepository.removeProductFromCart(cartId, prodId);
      logger.info('Product removed from cart successfully:', { cartId, prodId });
    } catch (error) {
      logger.error('Error removing product from cart:', { error });
      throw error;
    }
  }

  async getCartWithProducts(cartId) {
    try {
      const cartWithProducts = await this.cartsRepository.getCartWithProducts(cartId);
      logger.info('Cart fetched with products successfully:', { cartId, cartWithProducts });
      return cartWithProducts;
    } catch (error) {
      logger.error('Error fetching cart with products:', { error });
      throw error;
    }
  }

  async addProductToCart(cartId, productDTO) {
    try {
      await this.cartsRepository.addProductToCart(cartId, productDTO);
      logger.info('Product added to cart successfully:', { cartId, productDTO });
    } catch (error) {
      logger.error('Error adding product to cart:', { error });
      throw error;
    }
  }

  async updateProductQuantity(cartId, prodId, quantity) {
    try {
      await this.cartsRepository.updateProductQuantity(cartId, prodId, quantity);
      logger.info('Product quantity updated successfully:', { cartId, prodId, quantity });
    } catch (error) {
      logger.error('Error updating product quantity:', { error });
      throw error;
    }
  }
}

export default CartController;