import {
      UserService
} from "../../services/users/users.services.js";

import {
      successResponse,
      errorResponse
} from "../../utils/responses/responses.utils.js";

import {
      compareHash
} from "../../utils/bcrypt/bcrypt.utils.js";
import CONFIG from "../../environments/config.js";

const userService = new UserService();

export class UserController {

      constructor() {

            this.formattedSuccessRes = this.formattedSuccessRes.bind(this);

            this.formattedErrorRes = this.formattedErrorRes.bind(this);

      }

      formattedSuccessRes(res, statusCode, message, payload) {

            const response = successResponse(statusCode, message, payload);

            res.status(statusCode).json(response);

      }

      formattedErrorRes(res, statusCode, message, error) {

            const response = errorResponse(statusCode ? statusCode : 500, message, error);

            res.status(statusCode ? statusCode : 500).json(response);

      }

      async createOne(req, res, next) {

            try {

                  const userToCreate = req.body;

                  const result = await userService.createOne(userToCreate);

                  this.formattedSuccessRes(res, 201, `Usuario ${result.email} creado correctamente`, result);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async loginOne(req, res, next) {

            try {

                  const {
                        email,
                        password
                  } = req.body;

                  const result = await userService.loginOne(email, password);

                  res.cookie("token", result.token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        maxAge: 1000 * 60 * 60 * 24 * 7
                  });

                  this.formattedSuccessRes(res, 200, `Usuario ${result.user.email}, inició sesión correctamente`, result);

            } catch (error) {

                  console.log(error);

                  // Esto no debería ser así, pero por ahora es lo que hay
                  const HTTP_STATUS = error.statusCode ? error.statusCode : 500;

                  const messageError = error.message ? error.message : "Error del servidor";

                  const errorDescription = error.errors ? error.errors : "Error no especificado";

                  this.formattedErrorRes(res, HTTP_STATUS, messageError, errorDescription);

            }

      }

      async checkSession(req, res, next) {

            try {

                  const user = req.user;

                  const token = req.token;

                  req.user = null;

                  req.token = null;

                  const response = {
                        user: user,
                        token: token
                  }

                  this.formattedSuccessRes(res, 200, `Usuario ${user.email}, sesión activa`, response);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async logout(req, res, next) {

            try {

                  const userId = req._id

                  const result = await userService.logout(userId);

                  res.clearCookie("token");

                  this.formattedSuccessRes(res, 200, `Sesión del usuario ${result.email}, cerrada correctamente`, {
                        sessionStatus: "closed"
                  });

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async sendResetEmail(req, res, next) {

            try {

                  const userEmail = req.user.email;

                  const userPassword = req.user.password;

                  const result = await userService.sendResetEmail(userEmail, userPassword);

                  this.formattedSuccessRes(res, 200, `Correo de modificación de email enviado correctamente`, result);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async resetEmail(req, res, next) {


            const {
                  token,
                  key,
                  result
            } = req;

            console.log(token, key, result);

            res.redirect(`${CONFIG.CLIENT_RESET_EMAIL_URL}?validKey=${result}&token=${token}&${key}`);

      }

      async updateBasicInfo(req, res, next) {

            try {

                  const oldUser = req.user;

                  req.user = null;

                  const newUserData = req.body;

                  const result = await userService.updateBasicInfo(oldUser, newUserData);

                  this.formattedSuccessRes(res, 200, `Usuario ${result.email} actualizado correctamente`, result);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async addAddressGeneric(req, res, next) {

            try {

                  const user = req.user;

                  const newAddress = req.body;

                  const addressType = req.body.type;

                  const result = await userService.addAddress(user, newAddress, addressType);

                  this.formattedSuccessRes(res, 200, `Se agregó la nueva dirección correctamente`, result);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async deleteAddressGeneric(req, res, next) {

            try {

                  const user = req.user;

                  const addressId = req.params.aId;

                  const addressType = req.params.type;

                  const result = await userService.deleteAddress(user, addressId, addressType);

                  this.formattedSuccessRes(res, 200, `Se eliminó la dirección correctamente`, result);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async deleteOne(req, res, next) {

            try {

                  const userId = req._id;

                  const result = await userService.deleteOne(userId);

                  res.clearCookie("token");

                  this.formattedSuccessRes(res, 200, `Usuario ${result.email}`, result);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async sendWholeSales(req, res, next) {

            try {

                  const userName = req.body.name

                  const userEmail = req.body.email

                  const consult = req.body.consult

                  const result = await userService.sendWholeSaleEmail(userEmail, userName, consult);

                  this.formattedSuccessRes(res, 200, `Correo enviado correctamente`, result);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

}