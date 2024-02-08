import { Router } from "express";
import UserDTO from "../dao/DTOs/user.dto.js";
import userRepository from "../repositories/User.repository.js";
import UsersDAO from "../dao/mongo/users.mongo.js";
import { transport } from "../utils.js";

const userRouter = Router();

const usersDAO = new UsersDAO();

userRouter.get("/", async (req, res) => {
    try {
        req.logger.info('Loading users');
        let result = await usersDAO.get();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        req.logger.error('Error loading users');
        res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
});

userRouter.post("/", async (req, res) => {
    try {
        let { first_name, last_name, email, age, password, rol } = req.body;
        let user = new UserDTO({ first_name, last_name, email, age, password, rol });
        let result = await userRepository.createUser(user);
        if (result) {
            req.logger.info('User created successfully');
        } else {
            req.logger.error("Error creating user");
        }
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        req.logger.error("Internal Server Error:", error);
        res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
});

userRouter.post("/premium/:uid", async (req, res) => {
    try {
        const { rol } = req.body;
        const allowedRoles = ['premium', 'admin', 'usuario'];
        const uid = req.params.uid;

        if (!allowedRoles.includes(rol)) {
            req.logger.error('Invalid role provided');
            return res.status(400).json({ error: 'Invalid role' });
        }

        if (!(await userRepository.hasRequiredDocuments(uid))) {
            req.logger.error('User does not have the required documents for premium role');
            return res.status(400).json({ error: 'User does not have the required documents for premium role' });
        }

        let changeRol = await userRepository.updUserRol({ uid, rol });

        if (changeRol) {
            req.logger.info('Role updated successfully');
            res.status(200).json({ message: 'Role updated successfully' });
        } else {
            req.logger.error('Error updating role');
            res.status(500).json({ error: 'Error updating role' });
        }
    } catch (error) {
        req.logger.error('Error in route /premium/:uid');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

userRouter.delete('/', async (req, res) => {
    try {
        const currentDate = new Date();
        const cutoffDate = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000); 
        const result = await usersDAO.deleteUsersByFilter({ last_connection: { $lt: cutoffDate } });
        if (result.length > 0) {
            for (const userEmail of result) {
                await transport.sendMail({
                    from: 'ed.zuleta_@live.cl',
                    to: userEmail,
                    subject: 'Account Deletion Due to Inactivity',
                    text: 'Your account has been deleted due to inactivity.'
                });
            }
            res.status(200).json({ message: 'Users deleted successfully.' });
        } else {
            res.status(500).json({ message: 'No users were deleted due to inactivity' });
        }
    } catch (error) {
        req.logger.error('Error deleting users');
        res.status(500).json({ error: 'Error deleting users' });
    }
});

export default userRouter;