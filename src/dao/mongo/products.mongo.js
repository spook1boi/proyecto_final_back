import { productsModel } from './models/products.model.js';
import mongoose from 'mongoose';
import ProductDTO from '../DTOs/product.dto.js';
import logger from '../../loggers.js'; 

class ProductsMongoDAO {
  async addProduct(productDTO) {
    try {
      const product = new productsModel(productDTO);
      await product.save();
      logger.info('Product added', { product: productDTO });
      return 'Product added';
    } catch (error) {
      logger.error(`Error adding product: ${error.message}`, { error, product: productDTO });
      return 'Error adding product';
    }
  }

  async updateProduct(id, productDTO) {
    try {
      const product = await productsModel.findById(id);
      if (!product) {
        logger.warn('Product not found', { productId: id });
        return 'Product not found';
      }
      product.set(productDTO);
      await product.save();
      logger.info('Product updated', { product: productDTO });
      return 'Product updated';
    } catch (error) {
      logger.error(`Error updating product: ${error.message}`, { error, productId: id, product: productDTO });
      return 'Error updating product';
    }
  }

  async getProducts() {
    try {
      const products = await productsModel.find({});
      const productDTOs = products.map(product => new ProductDTO(product));
      return productDTOs;
    } catch (error) {
      logger.error(`Error getting products: ${error.message}`, { error });
      return [];
    }
  }

  async getProductById(id) {
    try {
      const product = await productsModel.findById(id).lean();
      if (!product) {
        logger.warn('Product not found', { productId: id });
        return 'Product not found';
      }
      const productDTO = new ProductDTO(product);
      logger.debug('Retrieved product', { product: productDTO });
      return productDTO;
    } catch (error) {
      logger.error(`Error getting product: ${error.message}`, { error, productId: id });
      return 'Error getting product';
    }
  }

  async getProductsByCategory(category) {
    try {
      const products = await productsModel.find({ category });
      const productDTOs = products.map(product => new ProductDTO(product));
      logger.debug('Retrieved products by category', { category, products: productDTOs });
      return productDTOs;
    } catch (error) {
      logger.error(`Error getting products by category: ${error.message}`, { error, category });
      throw error;
    }
  }

  async getProductsMaster(page, limit, category, availability, sortOrder) {
    try {
      const filter = {};

      if (category) {
        filter.category = category;
      }

      if (availability) {
        filter.stock = { $gt: 0 };
      }

      const sort = {};

      if (sortOrder === 'desc') {
        sort.price = -1;
      } else {
        sort.price = 1;
      }

      const options = {
        skip: (page - 1) * limit,
        limit: limit,
      };

      const products = await productsModel.find(filter).sort(sort).skip(options.skip).limit(options.limit);
      logger.debug('Retrieved products with filters', { filter, sort, options, products });

      return products;
    } catch (error) {
      logger.error(`Error getting products: ${error.message}`, { error });
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await productsModel.findById(id);
      if (!product) {
        logger.warn('Product not found', { productId: id });
        return 'Product not found';
      }
      await product.remove();
      logger.info('Product deleted', { productId: id });
      return 'Product deleted';
    } catch (error) {
      logger.error(`Error deleting product: ${error.message}`, { error, productId: id });
      return 'Error deleting product';
    }
  }
}

export default ProductsMongoDAO;