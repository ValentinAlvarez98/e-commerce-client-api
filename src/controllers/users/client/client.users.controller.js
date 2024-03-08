import {
      ClientUserService as ClientService
} from "../../../services/users/client/client.users.services.js";

import {
      successResponse,
      errorResponse
} from "../../../utils/responses/responses.utils.js";

const clientService = new ClientService();

export class ClientUsersController {

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

                  const result = await clientService.createOne(userToCreate);

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

                  const result = await clientService.loginOne(email, password);

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

                  const result = await clientService.logout(userId);

                  res.clearCookie("token");

                  this.formattedSuccessRes(res, 200, `Sesión del usuario ${result.email}, cerrada correctamente`, {
                        sessionStatus: "closed"
                  });

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async updateBasicInfo(req, res, next) {

            try {

                  const oldUser = req.user;

                  req.user = null;

                  const newUserData = req.body;

                  const result = await clientService.updateBasicInfo(oldUser, newUserData);

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

                  const result = await clientService.addAddress(user, newAddress, addressType);

                  this.formattedSuccessRes(res, 200, `Usuario ${result.email} actualizado correctamente`, result);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async deleteAddressGeneric(req, res, next) {

            try {

                  const user = req.user;

                  const addressId = req.params.aId;

                  const addressType = req.params.type;

                  const result = await clientService.deleteAddress(user, addressId, addressType);

                  this.formattedSuccessRes(res, 200, `Usuario ${result.email} actualizado correctamente`, result);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async deleteOne(req, res, next) {

            try {

                  const userId = req._id;

                  const result = await clientService.deleteOne(userId);

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

                  const result = await clientService.sendWholeSaleEmail(userEmail, userName, consult);

                  this.formattedSuccessRes(res, 200, `Correo enviado correctamente`, result);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

}