import { Router } from "express";
import ProductDTO from "../dao/DTOs/product.dto.js";
import productRepository from "../repositories/Products.repository.js";
import userRepository from "../repositories/User.repository.js";
import ProductsDAO from "../dao/mongo/products.mongo.js";
import logger from "../loggers.js"; 

const prodRouter = Router();

const productsDAO = new ProductsDAO();

prodRouter.use((req, res, next) => {
    req.logger = logger; 
    next();
});

prodRouter.get("/", async (req, res) => {
    try {
        req.logger.info('Loading products');
        let result = await productsDAO.get();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        req.logger.error('Error loading products');
        res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
});

prodRouter.get("/:id", async (req, res) => {
    try {
        const prodId = req.params.id;
        const userEmail = req.query.email;
        const productDetails = await productsDAO.getProductById(prodId);
        res.render("viewProducts", { product: productDetails, email: userEmail });
    } catch (error) {
        req.logger.error('Error obtaining product:', error);
        res.status(500).json({ error: 'Error obtaining product' });
    }
});

prodRouter.post("/", async (req, res) => {
    let { title, image, price, stock, category, owner } = req.body;
    
    if (!owner || owner === '') {
        owner = 'admin@admin.cl';
    }
    
    const product = { title, image, price, stock, category, owner };
    
    if (!title || !price) {
        req.logger.error("Missing description or price while creating product");
        return res.status(400).json({ error: 'Missing description or price while creating product' });
    }

    try {
        let prod = new ProductDTO({ title, image, price, stock, category, owner });
        let userPremium = await userRepository.getRolUser(owner);

        if (userPremium === 'premium') {
            let result = await productRepository.createProduct(prod);
            res.status(200).send({ status: "success", payload: result });
            req.logger.info('Product created successfully by premium user');
        } else {
            req.logger.error("Owner must be a premium user");
            res.status(500).send({ status: "error", message: "Internal Server Error" });
        }
    } catch (error) {
        req.logger.error("Internal Server Error:", error);
        res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
});

prodRouter.delete('/:idProd', async (req, res) => {
    try {
        const idProducto = req.params.idProd;
        let ownerProd = await productsDAO.getProductOwnerById(idProducto);
        let userRol = await userRepository.getRolUser(ownerProd.owner);

        if (userRol === 'premium') {
            await transport.sendMail({
                from: 'ed.zuleta_@live.cl',
                to: ownerProd.owner,
                subject: 'Producto eliminado con Owner Premium',
                html: `El producto con id ${idProducto} ha sido eliminado.`,
            });
        }

        await productsDAO.deleteProduct(idProducto);
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        req.logger.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product.' });
    }
});

export default prodRouter;