import cartsModel from './models/carts.model.js';
import productsModel from './models/products.model.js';
import mongoose from 'mongoose';
import logger from '../../loggers.js';

export default class Carts {
    constructor() {}

    async get() {
        try {
            const carts = await cartsModel.find();
            return carts;
        } catch (error) {
            logger.error("Error al obtener los carritos:", { error });
            throw new Error("Error interno al obtener los carritos");
        }
    }

    async getCart(id_cart) {
        try {
            const cart = await cartsModel.findById(id_cart);
            if (!cart) {
                return { error: "No se encontró el carrito con el ID proporcionado" };
            }
            return { cart };
        } catch (error) {
            logger.error("Error al obtener el carrito:", { error });
            throw new Error("Error interno al obtener el carrito");
        }
    }

    async getStock({ productos }) {
        try {
            const stockInfo = {};
            const errors = [];
            for (const producto of productos) {
                const productInCollection = await productsModel.findOne({ title: producto.title });
                if (!productInCollection) {
                    errors.push({ title: producto.title, error: `El producto no se encuentra en la colección` });
                    stockInfo[producto.title] = { status: 'No encontrado en la colección' };
                    continue;
                }
                if (productInCollection.stock >= producto.stock) {
                    await productsModel.updateOne(
                        { title: productInCollection.title },
                        { $inc: { stock: -producto.stock } }
                    );
                    stockInfo[producto.title] = {
                        status: 'Suficiente',
                        availableQuantity: productInCollection.stock - producto.stock,
                        requiredQuantity: producto.stock,
                    };
                } else {
                    errors.push({ title: producto.title, error: 'Insuficiente' });
                    stockInfo[producto.title] = { status: 'Insuficiente' };
                }
            }
            if (errors.length > 0) {
                return { errors, stockInfo };
            }
            return stockInfo;
        } catch (error) {
            logger.error("Error al obtener el stock:", { error });
            throw new Error("Error interno al obtener el stock");
        }
    };

    async getAmount({ productos }) {
        try {
            let totalAmount = 0;
            if (!productos || !Array.isArray(productos)) {
                logger.error('La propiedad "productos" no es un array válido.');
                return totalAmount;
            }
            for (const producto of productos) {
                totalAmount += producto.price * producto.stock;
            }
            return totalAmount;
        } catch (error) {
            logger.error("Error al calcular el monto:", { error });
            return 0;
        }
    };

    async addCart(cart) {
        try {
            let result = await cartsModel.create(cart);
            logger.info("Carro creado correctamente");
            return result;
        } catch (error) {
            logger.error('Error al crear el carrito:', { error });
            throw new Error('Error al crear el carrito');
        }
    }

    async addToCart(cartId, productId, quantity) {
        try {
            const cart = await cartsModel.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
    
            const existingProductIndex = cart.products.findIndex(product => product.productId.equals(productId));
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({
                    productId: productId,
                    quantity: quantity,
                });
            }
    
            await cart.save();
            logger.info("Producto agregado al carrito correctamente");
            return cart;
        } catch (error) {
            logger.error('Error al agregar producto al carrito:', { error });
            throw new Error('Error al agregar producto al carrito');
        }
    };

    async getCartWithProducts(cartId) {
        try {
            const cart = await cartsModel.findById(cartId).populate('products.productId').lean();
            if (!cart) {
                return 'Carrito no encontrado';
            }
            return cart;
        } catch (error) {
            logger.error('Error al obtener el carrito con productos:', { error });
            throw new Error('Error al obtener el carrito con productos');
        }
    }     
}