import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import logger from "../loggers.js";

const prodRouter = Router();
const productController = new ProductController();

const errorHandler = (res, error) => {
  logger.error('Error:', { error });
  res.status(500).json({ error: 'Internal Server Error' });
};

prodRouter.get("/products/:pid", async (req, res) => {
  try {
    const prodId = req.params.pid;
    const productDetails = await productController.getProductById(prodId);

    if (productDetails === 'Product not found') {
      res.status(404).json({ error: 'Product not found' });
    } else {
      logger.info('Product details fetched successfully');
      res.render('productDetails', { layout: 'main', title: 'Detalles del Producto', product: productDetails });
    }
  } catch (error) {
    logger.error('Error getting the product:', { error });
    res.status(500).json({ error: 'Error getting the product' });
  }
});

prodRouter.get("/products/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await productController.getProductsByCategory(category);
    if (products.length === 0) {
      res.status(404).json({ error: 'No se encontraron productos en la categoría proporcionada.' });
    } else {
      logger.info('Products fetched by category successfully');
      res.json(products);
    }
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.get("/products/limit/:limit", async (req, res) => {
  try {
    let limit = parseInt(req.params.limit) ?? 10;
    logger.info(`Products fetched with limit: ${limit}`);
    res.json(await productController.getProductsByLimit(limit));
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.get("/products/page/:page", async (req, res) => {
  try {
    const page = parseInt(req.params.page) ?? 1;
    if (page <= 0) {
      logger.error('Invalid page number');
      return res.status(400).json({ error: 'Invalid page number' });
    }
    const productsPerPage = 10;
    const products = await productController.getProductsByPage(page, productsPerPage);
    logger.info('Products fetched by page successfully');
    res.json(products);
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.put("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updProd = req.body;
    logger.info(`Product updated with ID: ${pid}`);
    res.json(await productController.updateProduct(pid, updProd));
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.get("/products/search/query", async (req, res) => {
  try {
    const query = req.query.q;
    logger.info(`Products fetched by search query: ${query}`);
    res.json(await productController.getProductsByQuery(query));
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;
    logger.info('Product added successfully');
    res.json(await productController.addProduct(newProduct));
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.delete("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    logger.info(`Product deleted with ID: ${pid}`);
    res.json(await productController.delProducts(pid));
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.get("/products", async (req, res) => {
  try {
    const { sortOrder = "asc", category = "", availability = "" } = req.query;
    const products = await productController.getProductsMaster(null, null, category, availability, sortOrder);
    logger.info('Products fetched successfully');
    res.json(products);
  } catch (error) {
    errorHandler(res, error);
  }
});

export default prodRouter;