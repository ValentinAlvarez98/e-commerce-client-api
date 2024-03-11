import DAOs from "../../models/daos/index.daos.js";

import {
      compareHash,
      createHash
} from "../../utils/bcrypt/bcrypt.utils.js";

import {
      generateJWT
} from "../../utils/JWT/jwt.utils.js";

import {
      deleteEmpty
} from "../../utils/deleteEmpty/deleteEmpty.utils.js";

import {
      sendWelcomeEmail,
      sendGoodbyeEmail,
      sendWholeSaleEmail,
      sendResetEmail
} from "../../utils/mailing/mailing.utils.js";

import CONFIG from "../../environments/config.js";

export class UserService {

      async loadUser(id) {

            const dbResponse = await DAOs.users.getOneById(id);

            if (!dbResponse) {

                  throw {
                        statusCode: 404,
                        message: "Error al obtener el usuario",
                        errors: ["El usuario no existe"],
                  }

            }

            return dbResponse;

      }

      async createOne(user) {

            user.password = createHash(user.password);

            const userToCreate = {
                  ...user,
                  display_name: `${user.email}`,
                  last_activity: new Date().toISOString(),
            }

            const dbResponse = await DAOs.users.addOne(userToCreate);

            if (!dbResponse) {

                  throw {
                        statusCode: 404,
                        message: "Error al crear el usuario",
                        errors: ["No se pudo crear el usuario"],
                  }

            }

            const completeName = `${userToCreate.first_name} ${userToCreate.last_name}`

            sendWelcomeEmail(dbResponse.email, completeName);

            return dbResponse;

      }

      async loginOne(email, password) {

            try {

                  const dbResponse = await DAOs.users.getOneByEmail(email);

                  if (!dbResponse) {

                        throw {
                              statusCode: 404,
                              message: "Error al iniciar sesion",
                              errors: ["El usuario no existe"],
                        }

                  }

                  const isPasswordValid = await this.comparePassword(password, dbResponse.password);

                  const token = await this.generateToken(dbResponse._id);


                  const userUpdated = await this.updateActivity(dbResponse._id);

                  return {
                        user: userUpdated,
                        token
                  }
            } catch (error) {

                  console.log(error)

                  throw error;

            }

      }

      async comparePassword(password, userPassword) {

            const isPasswordValid = compareHash(password, userPassword);

            if (!isPasswordValid) {

                  throw {
                        statusCode: 404,
                        message: "Error al iniciar sesion",
                        errors: ["La contraseña no es valida"],
                  }

            }

            return isPasswordValid;

      }

      async generateToken(id) {

            const token = generateJWT(id);

            if (!token) {

                  throw {
                        statusCode: 404,
                        message: "Error al crear el token",
                        errors: ["No se pudo crear el token"],
                  }

            }

            return token;

      }

      async updateActivity(id) {

            const now = new Date();

            const dbResponse = await DAOs.users.updateOne(id, {
                  last_activity: now
            });

            if (dbResponse.errors) {

                  throw {
                        statusCode: 404,
                        message: "Error al actualizar la actividad",
                        errors: ["No se pudo actualizar la actividad del usuario"],
                  }

            }

            return dbResponse;

      }

      async logout(id) {

            const dbResponse = await this.updateActivity(id);

            if (dbResponse.errors) {

                  throw {
                        statusCode: 404,
                        message: "Error al cerrar la sesión",
                        errors: ["No se pudo actualizar la actividad del usuario"],
                  }

            }

            return dbResponse;

      }

      async sendResetEmail(email, password) {

            const key = createHash(password);

            const encodedKey = encodeURIComponent(key);

            const resetLink = `${CONFIG.RESET_EMAIL_URL}/${encodedKey}`;

            try {

                  const response = await sendResetEmail(email, resetLink);

                  return response;

            } catch (error) {

                  throw {
                        statusCode: 404,
                        message: "Error al enviar el correo",
                        errors: ["No se pudo enviar el correo"],
                  }

            }

      }

      async updateBasicInfo(oldUser, newUserData) {

            const newData = deleteEmpty(newUserData);

            const userToUpdate = {
                  ...oldUser,
                  ...newData,
                  last_activity: new Date().toISOString()
            }

            const updatedUser = await DAOs.users.updateOne(oldUser._id, userToUpdate);

            if (!updatedUser) {

                  throw {
                        statusCode: 404,
                        message: "Error al actualizar el usuario",
                        errors: ["No se pudo actualizar el usuario"],
                  }

            }

            return updatedUser;

      }

      async addAddress(user, newAddress, addressType) {

            const addressField = addressType === 'shipping' ? 'shipping_addresses' : 'billing_address';

            const oldAddresses = user[addressField] ? user[addressField] : [];

            oldAddresses.push(newAddress);

            const newUser = {
                  ...user,
                  [addressField]: oldAddresses,
                  last_activity: new Date().toISOString()
            }

            const response = await DAOs.users.updateOne(user._id, newUser);

            if (!response) {

                  throw {
                        statusCode: 404,
                        message: "Error al actualizar el usuario",
                        errors: ["No se pudo actualizar el usuario"],
                  }

            }

            return response;

      }

      async deleteAddress(user, addressId, addressType) {

            const addressField = addressType === 'shipping' ? 'shipping_addresses' : 'billing_address';

            const newAddresses = user[addressField].filter(address => address._id.toString() !== addressId);

            if (newAddresses.length === user[addressField].length) {

                  throw {
                        statusCode: 404,
                        message: "Error al eliminar la dirección",
                        errors: ["No se encontró la dirección"],
                  }

            }

            const updatedUser = await DAOs.users.updateOne(user._id, {
                  [addressField]: newAddresses,
                  last_activity: new Date().toISOString()
            });

            if (!updatedUser) {

                  throw {
                        statusCode: 404,
                        message: "Error al actualizar el usuario",
                        errors: ["No se pudo actualizar el usuario"],
                  }

            }

            return updatedUser;

      }

      async deleteOne(userId) {

            const response = await DAOs.users.deleteOne(userId);

            if (!response) {

                  throw {
                        statusCode: 404,
                        message: "Error al eliminar el usuario",
                        errors: ["No se pudo eliminar el usuario"],
                  }

            }

            sendGoodbyeEmail(response.email);

            return response;

      }

      async sendWholeSaleEmail(email, name, consult) {

            try {

                  const response = await sendWholeSaleEmail(email, name, consult);

                  return response;

            } catch (error) {

                  throw {
                        statusCode: 404,
                        message: "Error al enviar el correo",
                        errors: ["No se pudo enviar el correo"],
                  }

            }

      }

}