import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { engine } from "express-handlebars";
import * as path from "path";
import MongoStore from "connect-mongo";
import session from "express-session";
import FileStore from "session-file-store";
import winston from 'winston';

import logger from './loggers.js'; 

import "../src/db/db.config.js";
import dotenv from 'dotenv';
import __dirname from "./utils.js";

dotenv.config();

import prodRouter from "../src/routes/product.router.js";
import cartRouter from "../src/routes/cart.router.js";
import userRouter from "../src/routes/user.router.js";
import loggerTestRouter from "../src/routes/loggerTest.js"

import initializePassport from '../src/config/passport.config.js'
import ProductController from "../src/controllers/ProductController.js";
import CartController from "../src/controllers/CartController.js";

initializePassport(passport);

const app = express();

const PORT = process.env.PORT || 8080;
const productController = new ProductController();
const cartController = new CartController();
const fileStorage = FileStore(session);

if (process.env.NODE_ENV === 'development') {
  logger.level = 'debug';
} else {
  logger.level = 'info';
}

// Configuración de Winston
const consoleTransport = new winston.transports.Console();
const fileTransport = new winston.transports.File({ filename: 'combined.log' });

const winstonLogger = winston.createLogger({
  transports: [consoleTransport, fileTransport],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

logger.winston = winstonLogger;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3600,
    }),
    secret: process.env.SESSION_SECRET || "SecretPassword",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"));

app.use("/", express.static(__dirname + "/public"));

app.use("/api", prodRouter);
app.use("/api", cartRouter);
app.use("/api/sessions", userRouter);
app.use('/api', loggerTestRouter);

app.get("/", async (req, res) => {
    try {
      const productData = await productController.getProducts();
      const page = parseInt(req.query.page) || 1;
  
      const user = {
        first_name: req.session.firstName,
        last_name: req.session.lastName,
        rol: req.session.rol,
      };
  
      logger.info('User object:', { user });
      res.render("home", {
        title: "Vista Products",
        products: productData,
        page: page,
        user: user,
      });
    } catch (error) {
      logger.error('Error al obtener productos:', { error });
      res.status(500).send('Error al obtener productos');
    }
  });

app.get('/api/sessions/register', async (req, res) => {
    res.render('register', { title: 'Register' });
});

app.get('/api/sessions/login', async(req, res) => {
    res.render('login', { title: 'Login' });
});

app.get('/api/sessions/profile', async(req, res) => {
    try {
        const user = {
            first_name: req.session.firstName,
            last_name: req.session.lastName,
            email: req.session.emailUser,
            age: 30,
            rol: req.session.rol,
        };

        res.render('profile', user);
    } catch (error) {
        logger.error('Error al acceder al perfil:', { error });
        res.status(500).send('Error al acceder al perfil');
    }
});

app.get("/carts/:cid", async (req, res) => {
    try {
        let id = req.params.cid;
        let allCarts = await cartController.getCartWithProducts(id);
        res.render("viewCart", {
            title: "Vista Cart",
            carts: allCarts
        });
    } catch (error) {
        logger.error('Error al obtener carrito con productos:', { error });
        res.status(500).send('Error al obtener carrito con productos');
    }
});

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { error: err });
  res.status(500).send('Something went wrong!');
});

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        logger.info("Connected to Mongo");
    })
    .catch((error) => {
        logger.error("Error connecting to Mongo, error" + error);
    });

app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});