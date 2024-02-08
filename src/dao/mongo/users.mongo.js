import usersModel from './models/users.model.js';
import logger from '../../loggers.js';

export default class Users {
    constructor() {

    }

    async get() {
        try {
            const users = await usersModel.find().select('_id first_name email rol');
            return users;
        } catch (error) {
            logger.error('Error al obtener usuarios:', error);
            return 'Error obtener usuarios';
        }
    }

    async getUserById(id) { 
        try {
            const user = await usersModel.findById(id).lean();    
            if (!user) {
                return 'Usuario no encontrado';
            }   
            return user;
        } catch (error) {
            logger.error('Error al obtener el usuario:', error);
            return 'Error al obtener el usuario';
        }
    }

    async findEmail(param) {
        try {
            const user = await usersModel.findOne(param);  
            return user;
        } catch (error) {
            logger.error('Error al buscar email:', error);
            return 'Error al buscar email de usuario';
        }   
    }

    async addUser(userData) {
        try {
            const userCreate = await usersModel.create(userData);
            logger.info("Usuario creado correctamente");
            return userCreate;
        } catch(error) {
            logger.error('Error al crear usuario:', error);
            return 'Error al crear usuario';
        }      
    }

    async getUserRoleByEmail(email) {
        try {
            const user = await usersModel.findOne({ email });
            if (user && user.rol === 'premium') {
                return 'premium';
            } else {
                return "usuario con otro rol";
            }
        } catch (error) {
            logger.error('Error al obtener el rol del usuario:', error);
            return 'Error al obtener el rol del usuario';
        }
    }

    async getIdCartByEmailUser(email) {
        try {
            const user = await usersModel.findOne({ email });
            if (user && user.id_cart) {
                return user.id_cart;
            } else {
                return null;
            }
        } catch (error) {
            logger.error('Error al obtener el rol del usuario:', error);
            return 'Error al obtener el rol del usuario';
        }
    }

    async updatePassword(email, newPassword) {
        try {
            const updatedUser = await usersModel.findOneAndUpdate(
                { email: email },
                { $set: { password: newPassword } },
                { new: true } 
            );
            if (updatedUser) {
                return updatedUser;
            } else {
                logger.error('Usuario no encontrado');
            }
        } catch (error) {
            logger.error('Error al actualizar la contraseña:', error);
            return 'Error al actualizar la contraseña';
        }
    }

    async updateLastConnection(email) {
        try {
            const updatedUser = await usersModel.findOneAndUpdate(
                { email: email },
                { $set: { last_connection: new Date() } },
                { new: true }
            );
            if (updatedUser) {
                return updatedUser;
            } else {
                logger.error('Usuario no encontrado');
                return null;
            }
        } catch (error) {
            logger.error('Error al actualizar la última conexión:', error);
            throw error;
        }
    }

    async updateIdCartUser({ email, newIdCart }) {
        try {
            const updatedUser = await usersModel.findOneAndUpdate(
                { email: email },
                { $set: { id_cart: newIdCart } },
                { new: true }
            );
            if (updatedUser) {
                return updatedUser;
            } else {
                logger.error('Usuario no encontrado');
                return null;
            }
        } catch (error) {
            logger.error('Error al actualizar el id_Cart del usuario:', error);
            throw error;
        }
    }

    async findJWT(filterFunction) {
        try {
            const user = await usersModel.find(filterFunction);
            return user;
        } catch(error) {
            logger.error('Error al obtener filtro JWT:', error);
            return 'Error al obtener filtro JWT';
        }      
    }

    async getPasswordByEmail(email) {
        try {
            const user = await usersModel.findOne({ email: email }).lean();
            if (user) {
                const pass = user.password;
                return pass; 
            } else {
                return null; 
            }
        } catch (error) {
            logger.error('Error al obtener el usuario:', error);
            return 'Error al obtener el usuario';
        }
    }

    async updateUserRoleById({ uid, rol }) {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(
                uid,
                { $set: { rol: rol } },
                { new: true }
            );
            if (updatedUser) {
                return updatedUser;
            } else {
                logger.error('Usuario no encontrado');
                return null;
            }
        } catch (error) {
            logger.error('Error al actualizar el rol:', error);
            return 'Error al actualizar el rol';
        }
    }

    async deleteUser(userId) {
        try {
            const idToDelete = typeof userId === 'object' ? userId.id : userId;
            const deletedUser = await usersModel.deleteOne({ _id: idToDelete });
            return deletedUser;
        } catch (error) {
            logger.error('Error al eliminar usuario:', error);
            return 'Error al eliminar usuario';
        }
    }

    async deleteUsersByFilter(filter) {
        try {
            const usersToDelete = await usersModel.find(filter);
            const deletedUserEmails = usersToDelete.map(user => user.email);
            const result = await usersModel.deleteMany(filter);
            if (result.deletedCount > 0) {
                return deletedUserEmails;
            } else {
                return [];
            }
        } catch (error) {
            logger.error('Error al eliminar usuarios:', error);
            throw error;
        }
    }

    async updateDocuments(userId, newDocuments) {
        try {
            const user = await usersModel.findById(userId);
            if (!user) {
                logger.error('Usuario no encontrado');
                return null;
            }
            if (!Array.isArray(user.documents)) {
                user.documents = [];
            }
            user.documents.push(...(Array.isArray(newDocuments) ? newDocuments : [newDocuments]));
            const updatedUser = await user.save();
            return updatedUser;
        } catch (error) {
            logger.error('Error al actualizar los documentos:', error);
            throw error;
        }
    }

    async hasRequiredDocuments(userId) {
        try {
            const user = await usersModel.findById(userId);
            if (!user || !Array.isArray(user.documents)) {
                return false;
            }
            const requiredDocumentNames = ['identificacion', 'comprobante_domicilio', 'comprobante_estado_cuenta'];
            for (const requiredDocumentName of requiredDocumentNames) {
                const hasDocument = user.documents.some(doc => doc.name === requiredDocumentName);
                if (!hasDocument) {
                    return false;
                }
            }
            return true;
        } catch (error) {
            logger.error('Error al verificar los documentos:', error);
            throw error;
        }
    }
}