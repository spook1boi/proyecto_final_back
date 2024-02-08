import productsModel from './models/products.model.js';
import mongoose from 'mongoose';
import logger from '../../loggers.js';

export default class Products {
    constructor() {}

    async get() {
        try {
            let products = await productsModel.find().lean();
            return products;
        } catch (error) {
            logger.error('Error al obtener productos:', { error });
            throw new Error('Error interno al obtener productos');
        }
    }

    async addProduct(prodData) {
        try {
            let prodCreate = await productsModel.create(prodData);
            return prodCreate;
        } catch (error) {
            logger.error('Error al crear producto:', { error });
            throw new Error('Error al crear producto');
        }
    }

    async updateProduct(prodId, prodData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(prodId)) {
                return 'ID de producto no válido';
            }
            let updatedProduct = await productsModel.updateOne({ _id: new mongoose.Types.ObjectId(prodId) }, { $set: prodData });
            return updatedProduct;
        } catch (error) {
            logger.error('Error al actualizar producto:', { error });
            throw new Error('Error al actualizar producto');
        }
    }

    async deleteProduct(productId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return 'ID de producto no válido';
            }
            let deletedProduct = await productsModel.deleteOne({ _id: new mongoose.Types.ObjectId(productId) });
            return deletedProduct;
        } catch (error) {
            logger.error('Error al eliminar producto:', { error });
            throw new Error('Error al eliminar producto');
        }
    };

    async getProductById(id) {
        try {
            const prod = await productsModel.findById(id).lean();
            if (!prod) {
                return 'Producto no encontrado';
            }
            return prod;
        } catch (error) {
            logger.error('Error al obtener el producto:', { error });
            throw new Error('Error al obtener el producto');
        }
    }

    async getProductOwnerById(productId) {
        try {
            const product = await productsModel.findById(productId).lean();
            if (!product) {
                return 'Producto no encontrado';
            }
            const ownerId = product.owner;
            if (ownerId) {
                return { owner: ownerId };
            } else {
                return 'Owner no encontrado';
            }
        } catch (error) {
            logger.error('Error al obtener el owner del producto:', { error });
            throw new Error('Error al obtener el owner del producto');
        }
    };
}