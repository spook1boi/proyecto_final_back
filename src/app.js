import express from 'express'
import mongoose from 'mongoose'
import config from './config/config.js'
import passport from "passport"
import cookieParser from "cookie-parser"
import initializeCartRouter from './routes/cart.router.js';
import productsRouter from './routes/product.router.js'
import usersRouter from './routes/user.router.js'
import ticketsRouter from './routes/tickets.router.js'
import UserMongo from "./dao/mongo/users.mongo.js"
import ProdMongo from "./dao/mongo/products.mongo.js"
import CartMongo from "./dao/mongo/carts.mongo.js"
import TicketMongo from "./dao/mongo/tickets.mongo.js"
import UserRepository from './repositories/User.repository.js'
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import __dirname, { authorization, passportCall, transport, createHash, isValidPassword } from "./utils.js"
import initializePassport from "./config/passport.config.js"
import * as path from "path"
import {generateAndSetToken, generateAndSetTokenEmail, 
    validateTokenResetPass, getEmailFromToken, getEmailFromTokenLogin} from "./jwt/token.js"
import UserDTO from './dao/DTOs/user.dto.js'
import { engine } from "express-handlebars"
import { nanoid } from 'nanoid'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUIExpress from 'swagger-ui-express'
import bodyParser from 'body-parser'
import { createLogger, transports, format } from 'winston';

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
    format: combine(
        label({ label: 'server' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' })
    ]
});

const app = express()
const port = config.port || 8080

const users = new UserMongo()
const products = new ProdMongo()
const carts = new CartMongo()
const tickets = new TicketMongo()
const userRepository = new UserRepository();

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    logger.info("Connected to MongoDB");
})
.catch(error => {
    logger.error("Error connecting to MongoDB", { error });
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Secret-key"
}

passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done)=>{
        const user = users.findJWT((user) =>user.email ===jwt_payload.email)
        if(!user)
        {
            return done(null, false, {message:"Usuario no encontrado"})
        }
        return done(null, user)
    })
)

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

const httpServer = app.listen(port, () => {
    logger.info(`Servidor corriendo en el puerto ${port}`)
})

const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title: 'Documentación API',
            description:'Documentación Swagger'
        }
    },
    apis:[`src/docs/users.yaml`,
          `src/docs/products.yaml`,
          `src/docs/tickets.yaml`,
          `src/docs/carts.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

app.use("/carts", initializeCartRouter(logger));
app.use("/products", productsRouter)
app.use("/users", usersRouter)
app.use("/tickets", ticketsRouter)

app.post('/sessions/register', async (req, res) => {
    try {
        let { first_name, last_name, email, age, password } = req.body;
        let user = new UserDTO({ first_name, last_name, email, age, password });
        let result = await UserRepository.createUser(user);
        if (result) {
            logger.info('User created successfully');
            res.status(200).json({ status: "success", message: "User created successfully" });
        } else {
            logger.error("Error creating user");
            res.status(500).json({ status: "error", message: "Error creating user" });
        }
    } catch (error) {
        logger.error("Internal Server Error:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});

app.post("/sessions/login", async (req, res) => {
    const { email, password } = req.body;
    const emailToFind = email;
    const user = await users.findEmail({ email: emailToFind });

    if (!user) {
      logger.error("Error de autenticación: Usuario no encontrado");
      return res.status(401).json({ message: "Error de autenticación" });
    }

    try {
        const passwordMatch = isValidPassword(user, password);

        if (!passwordMatch) {
            logger.error("Error de autenticación: Contraseña incorrecta");
            return res.status(401).json({ message: "Error de autenticación" });
        }

        const token = generateAndSetToken(res, email, password); 
        const userDTO = new UserDTO(user);
        const prodAll = await products.get();
        users.updateLastConnection(email)
        res.json({ token, user: userDTO, prodAll });

        logger.info("Inicio de sesión exitoso para el usuario: " + emailToFind);
    } catch (error) {
        logger.error("Error al comparar contraseñas: " + error.message);
        console.error("Error al comparar contraseñas:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

app.get('/', async (req, res) => {
    logger.info("Bienvenido!");
    try {
        let cartId = "";
        if (req.user) {
            cartId = req.user.cartId || "";
        }
        const prodAll = await products.get();
        res.render('home', { user: req.user, products: prodAll, cartId: cartId });
    } catch (error) {
        logger.error("Error al obtener productos:", error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.get('/logout', (req, res) => {
  logger.info("Se Cierra Sesión");
  let email = req.query.email
  users.updateLastConnection(email)
  res.redirect('/');
});

app.get('/sessions/register', (req, res) => {
    logger.info("Se inicia página de Registro de Usuarios");
    res.render('register', { root: app.get('views') });
});

app.get('/sessions/login', (req, res) => {
    logger.info("Se inicia página de Login");
    res.render('login', { root: app.get('views') });
});

app.get('/admin', passportCall('jwt'), authorization('user'), (req, res) =>{
  logger.info("Se inicia página de Administrador");
  authorization('user')(req, res, async() => {    
      const prodAll = await products.get();
      res.render('admin', { products: prodAll });
  });
});

app.get("/mockingproducts", async(req,res)=>{
    const products = [];
  
    for (let i = 0; i < 50; i++) {
        const product = {
            id: nanoid(),
            title: `Product ${i + 1}`,
            image: 'https://example.com/image.jpg',
            price: getRandomNumber(1, 1000),
            stock: getRandomNumber(1, 100),
            category: `Category ${i % 5 + 1}`
        };
  
        products.push(product);
    }
  
    res.send(products);
  });

app.get('/admin/users', passportCall('jwt'), authorization('user'), (req, res) =>{
  logger.info("Se inicia página de Administrador Usuario");
  authorization('user')(req, res, async() => {    
      const userAll = await users.get();
      const simplifiedUserData = userAll.map(user => ({
          _id: user._id.toString(),
          first_name: user.first_name,
          email: user.email,
          rol: user.rol,
      }));
      res.render('admin-user', { users: simplifiedUserData  });
  });
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const emailToFind = email;
  const userExists = await users.findEmail({ email: emailToFind });
  if (!userExists) {
    logger.error("Error al reestablecer contraseña usuario "+email+" no existe")
    console.error("Error al reestablecer contraseña usuario "+email+" no existe")
    res.json("Error al reestablecer contraseña usuario "+email+" no existe" );
    return res.status(401).json({ message: "Error al reestablecer contraseña" });
  }
  const token = generateAndSetTokenEmail(email)
  const resetLink = `http://localhost:8080/reset-password?token=${token}`;

  let result = transport.sendMail({
      from:'<ed.zuleta_@live.cl>',
      to:email,
      subject:'Restablecer contraseña',
      html:`Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetLink}">Restablecer contraseña</a>`,
      attachments:[]
  })
  if(result)
  {
      logger.info("Se envia correo para reestablecer contraseña a correo" + emailToFind);
      res.json("Correo para reestablecer contraseña fue enviado correctamente a "+email);
  }
  else
  {
      logger.error("Error al enviar correo para reestablecer contraseña");
      console.error("Error al intentar reestablecer contraseña");
      res.json("Error al intentar reestablecer contraseña");
  }
});

app.get('/reset-password', async (req, res) => {
  const { token} = req.query;
  const validate = validateTokenResetPass(token)
  const emailToken = getEmailFromToken(token)
  if(validate){
      res.render('resetPassword', { token , email: emailToken});
  }
  else{
      res.render('home', { root: app.get('views') });
  }
});

app.get("/carts/:cid", async (req, res) => {
  let id = req.params.cid
  let emailActive = req.query.email
  let allCarts  = await carts.getCartWithProducts(id)
  allCarts.products.forEach(producto => {
      producto.total = producto.quantity * producto.productId.price
  });
  const sumTotal = allCarts.products.reduce((total, producto) => {
      return total + (producto.total || 0);  
  }, 0);
  res.render("viewCart", {
      title: "Vista Carro",
      carts : allCarts,
      user: emailActive,
      calculateSumTotal: products => products.reduce((total, producto) => total + (producto.total || 0), 0)
  });
});

app.get("/checkout", async (req, res) => {
  let cart_Id = req.query.cartId
  let purchaser = req.query.purchaser
  let totalAmount = req.query.totalPrice
  let newCart = await carts.addCart()
  let newIdCart = newCart._id.toString()
  let updateUser = await users.updateIdCartUser({email: purchaser, newIdCart})
  if(updateUser)
  {
      const newTicket = {
          code: nanoid(),
          purchase_datetime: Date(),
          amount:totalAmount,
          purchaser: purchaser,
          id_cart_ticket:cart_Id
     }
     let result = await tickets.addTicket(newTicket)
     const newTicketId = result._id.toString();
     res.redirect(`/tickets/${newTicketId}`);
  }
});

app.get("/tickets/:tid", async (req, res) => {
  let id = req.params.tid
  let allTickets  = await tickets.getTicketById(id)
  res.render("viewTicket", {
      title: "Vista Ticket",
      tickets : allTickets
  });
});
