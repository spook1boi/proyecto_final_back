import { Router } from 'express';
import passport from 'passport';
import UserController from '../controllers/UserController.js';
import { generateToken } from '../utils.js'; 
import logger from "../loggers.js";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, rol } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      logger.error('Missing data');
      return res.status(400).send({ status: 400, error: 'Missing data' });
    }
    
    const defaultRole = 'user';

    const userToRegister = {
      first_name,
      last_name,
      email,
      age,
      password,
      rol: rol || defaultRole, 
    };

    const result = await userController.register(userToRegister);

    logger.info('User registered successfully');
    res.redirect("/api/sessions/login");
  } catch (error) {
    logger.error('Error while registering:', { error });
    res.status(500).send("Error while registering: " + error.message);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const result = await userController.login(req, res, next);

    if (result.error) {
      logger.error('Login failed:', { error: result.error });
      return res.status(result.status).send(result.error);
    }

    const { user, token, redirectPath } = result;

    req.logIn(user, async (loginErr) => {
      if (loginErr) {
        logger.error('Error al iniciar sesión:', { error: loginErr });
        return res.status(500).send("Error al iniciar sesión: " + loginErr.message);
      }

      const userPayload = {
        email: user.email,
        rol: user.rol,
      };

      const token = await generateToken(userPayload);
      logger.info('Token:', { token });
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); 

      if (user.rol === 'admin') {
        req.session.firstName = user.first_name;
        req.session.lastName = user.last_name;
        req.session.emailUser = user.email;
        req.session.rol = user.rol;
        res.redirect("/api/sessions/profile");
      } else {
        req.session.firstName = user.first_name;
        req.session.lastName = user.last_name;      
        req.session.emailUser = user.email;
        req.session.rol = user.rol;
        res.redirect(redirectPath);
      }
    });
  } catch (error) {
    logger.error('Error while logging in:', { error });
    res.status(500).send("Error while logging in: " + error.message);
  }
});

userRouter.get("/faillogin", (req, res) => {
  logger.error('Failed Login');
  res.send({ error: "Failed Login" });
});

userRouter.get("/logout", (req, res) => {
  try {
    const result = userController.logout(req, res);

    if (result.error) {
      logger.error('Logout Error:', { error: result.error });
      return res.status(result.status).json({ status: 'Logout Error', body: result.error });
    }

    res.clearCookie('token'); 
    logger.info('User logged out successfully');
    res.redirect('/api/sessions/login');
  } catch (error) {
    logger.error('Error while logging out:', { error });
    res.status(500).json({ status: 'Logout Error', body: error.message });
  }
});

userRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {});

userRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/api/sessions/login" }), (req, res) => {
  req.session.user = req.user;
  req.session.emailUser = req.session.user.email;
  req.session.rol = req.session.user.rol; 
  res.redirect("/");
});

userRouter.get('/current', async (req, res) => {
  try {
    const result = await userController.getCurrentUserInfo(req);

    if (result.error) {
      logger.error('Error while getting current user:', { error: result.error });
      return res.status(result.status).json({ message: result.error });
    }

    logger.info('Current user fetched successfully');
    return res.status(200).json(result.user);
  } catch (error) {
    logger.error('Error while getting current user:', { error });
    return res.status(500).json({ message: 'Error while getting current user' });
  }
});

userRouter.post('/change-role/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const newRole = req.body.newRole;

    if (!uid || !newRole) {
      logger.error('Missing user ID or new role');
      return res.status(400).json({ status: 400, error: 'Missing user ID or new role' });
    }

    const updatedUser = await userController.changeUserRole(uid, newRole);

    logger.info('User role changed successfully:', { userId: uid, newRole });
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error('Error while changing user role:', { error });
    res.status(500).json({ status: 'Error while changing user role', body: error.message });
  }
});

export default userRouter;