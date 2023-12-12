import ProductsRepository from '../repositories/Products.repository.js';
import logger from '../loggers.js';

class ProductController {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  async addProduct(req, res) {
    try {
      const productDTO = req.body;
      const result = await this.productsRepository.addProduct(productDTO);
      logger.info('Product added successfully:', { result });
      res.status(200).json({ status: 'success', message: result });
    } catch (error) {
      logger.error('Error adding product:', { error });
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const productDTO = req.body;
      const result = await this.productsRepository.updateProduct(productId, productDTO);
      logger.info('Product updated successfully:', { result });
      res.status(200).json({ status: 'success', message: result });
    } catch (error) {
      logger.error('Error updating product:', { error });
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getProducts() {
    try {
      const products = await this.productsRepository.getProducts();
      const productsJSON = products.map(product => product.toJSON());
      logger.info('Products fetched successfully:', { products: productsJSON });
      return productsJSON;
    } catch (error) {
      logger.error('Error fetching products:', { error });
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await this.productsRepository.getProductById(id);
      logger.info('Product fetched by ID successfully:', { product });
      return product;
    } catch (error) {
      logger.error('Error getting product by ID:', { error });
      throw error;
    }
  }

  async getProductsByCategory(req, res) {
    try {
      const category = req.params.category;
      const products = await this.productsRepository.getProductsByCategory(category);
      logger.info(`Products fetched by category '${category}' successfully:`, { products });
      res.status(200).json({ status: 'success', products: products });
    } catch (error) {
      logger.error('Error fetching products by category:', { error });
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getProductsMaster(page, limit, category, availability, sortOrder) {
    try {
      const products = await this.productsRepository.getProductsMaster(page, limit, category, availability, sortOrder);
      logger.info('Products fetched successfully:', { products });
      return { status: 'success', products: products };
    } catch (error) {
      logger.error('Error getting products:', { error });
      return { status: 'error', message: 'Error getting products' };
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const result = await this.productsRepository.deleteProduct(productId);
      logger.info('Product deleted successfully:', { result });
      res.status(200).json({ status: 'success', message: result });
    } catch (error) {
      logger.error('Error deleting product:', { error });
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default ProductController;