import { Router } from "express";
import CartManager from "../dao/mongo/carts.mongo.js";
import logger from "../loggers.js";

const cartRouter = Router();
const carts = new CartManager();

cartRouter.get("/carts", async (req, res) => {
  try {
    const result = await carts.getCarts();
    logger.info('Carts fetched successfully');
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error fetching carts:', { error });
    res.status(500).json({ message: 'Error fetching carts' });
  }
});

cartRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const result = await carts.getCartById(cartId);
    logger.info('Cart fetched by ID successfully');
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error fetching cart by ID:', { error });
    res.status(500).json({ message: 'Error fetching cart by ID' });
  }
});

cartRouter.post("/carts", async (req, res) => {
  try {
    const newCart = req.body;
    const result = await carts.addCart(newCart);
    if (result === 'Cart added') {
      logger.info('Cart added successfully');
      res.status(201).json({ message: 'Cart added successfully' });
    } else {
      logger.error('Could not add cart');
      res.status(400).json({ message: 'Could not add cart' });
    }
  } catch (error) {
    logger.error('Error adding cart:', { error });
    res.status(500).json({ message: 'Error adding cart' });
  }
});

cartRouter.post("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const result = await carts.addProductInCart(cartId, prodId);
    logger.info('Product added to cart successfully');
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error adding product to cart:', { error });
    res.status(500).json({ message: 'Error adding product to cart' });
  }
});

cartRouter.delete("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const result = await carts.removeProductFromCart(cartId, prodId);
    logger.info('Product removed from cart successfully');
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error removing product from cart:', { error });
    res.status(500).json({ message: 'Error removing product from cart' });
  }
});

cartRouter.put("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body;
    const result = await carts.updateProductsInCart(cartId, newProducts);
    logger.info('Cart updated with new products successfully');
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error updating cart with new products:', { error });
    res.status(500).json({ message: 'Error updating cart with new products' });
  }
});

cartRouter.put("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const newProduct = req.body;
    const result = await carts.updateProductInCart(cartId, prodId, newProduct);
    logger.info('Product in cart updated successfully');
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error updating product in cart:', { error });
    res.status(500).json({ message: 'Error updating product in cart' });
  }
});

cartRouter.delete("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const result = await carts.removeAllProductsFromCart(cartId);
    logger.info('All products removed from cart successfully');
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error removing all products from cart:', { error });
    res.status(500).json({ message: 'Error removing all products from cart' });
  }
});

cartRouter.get("/population/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const result = await carts.getCartWithProducts(cartId);
    logger.info('Cart with products fetched successfully');
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error fetching cart with products:', { error });
    res.status(500).json({ message: 'Error fetching cart with products' });
  }
});

export default cartRouter;