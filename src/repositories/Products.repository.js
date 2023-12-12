import ProductsMongoDAO from '../dao/mongo/products.mongo.js';
import ProductDTO from '../dao/DTOs/product.dto.js';
import logger from '../loggers.js'; 

class ProductsRepository {
  constructor() {
    this.productsDAO = new ProductsMongoDAO();
  }

  async addProduct(productDTO) {
    try {
      return await this.productsDAO.addProduct(productDTO);
    } catch (error) {
      logger.error('Error in addProduct:', { error });
      throw error;
    }
  }

  async updateProduct(id, productDTO) {
    try {
      return await this.productsDAO.updateProduct(id, productDTO);
    } catch (error) {
      logger.error('Error in updateProduct:', { error });
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await this.productsDAO.getProducts();
      return Array.isArray(products) ? products.map(product => new ProductDTO(product)) : [];
    } catch (error) {
      logger.error('Error in getProducts:', { error });
      throw error;
    }
  }

  async getProductById(id) {
    try {
      return await this.productsDAO.getProductById(id);
    } catch (error) {
      logger.error('Error in getProductById:', { error });
      throw error;
    }
  }

  async getProductsByCategory(category) {
    try {
      return await this.productsDAO.getProductsByCategory(category);
    } catch (error) {
      logger.error('Error in getProductsByCategory:', { error });
      throw error;
    }
  }

  async getProductsMaster(page, limit, category, availability, sortOrder) {
    try {
      const products = await this.productsDAO.getProductsMaster(page, limit, category, availability, sortOrder);
      return products;
    } catch (error) {
      logger.error('Error in getProductsMaster:', { error });
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      return await this.productsDAO.deleteProduct(id);
    } catch (error) {
      logger.error('Error in deleteProduct:', { error });
      throw error;
    }
  }
}

export default ProductsRepository;