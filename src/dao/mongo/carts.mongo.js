import { cartsModel } from './models/carts.model.js';
import mongoose from 'mongoose';
import CartDTO from '../DTOs/cart.dto.js';
import logger from '../../loggers.js';

class CartsMongoDAO {
  async getCarts() {
    try {
      const carts = await cartsModel.find({}).populate({
        path: 'products.productId',
        model: 'products',
        select: 'image description price stock',
      });
      return carts.map(cart => new CartDTO(cart));
    } catch (error) {
      logger.error(`Error in getCarts: ${error.message}`, { error });
      throw error;
    }
  }

  async addCart(cartDTO) {
    try {
      const cart = new cartsModel(cartDTO);
      await cart.save();
    } catch (error) {
      logger.error(`Error in addCart: ${error.message}`, { error });
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const id = new mongoose.Types.ObjectId(cartId);
      const cart = await cartsModel.findById(id);
      if (!cart) {
        logger.warn('Cart not found');
        return 'Cart not found';
      }
      return new CartDTO(cart);
    } catch (error) {
      logger.error(`Error in getCartById: ${error.message}`, { error });
      throw error;
    }
  }

  async removeProductFromCart(cartId, prodId) {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        logger.warn('Cart not found');
        return 'Cart not found';
      }

      const productIndex = cart.products.findIndex(product => product.productId.equals(prodId));

      if (productIndex === -1) {
        logger.warn('Product not found in the cart');
        return 'Product not found in the cart';
      }

      cart.products.splice(productIndex, 1);

      await cart.save();
    } catch (error) {
      logger.error(`Error in removeProductFromCart: ${error.message}`, { error });
      throw error;
    }
  }

  async getCartWithProducts(cartId) {
    try {
      const cart = await cartsModel.findById(cartId).populate({
        path: 'products.productId',
        model: 'products',
        select: 'image description price stock',
      });

      if (!cart) {
        logger.warn('Cart not found');
        return 'Cart not found';
      }

      return new CartDTO(cart);
    } catch (error) {
      logger.error(`Error in getCartWithProducts: ${error.message}`, { error });
      throw error;
    }
  }
}

export default CartsMongoDAO;