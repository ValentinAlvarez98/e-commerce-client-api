import Router from "express";

import {
      ClientUsersController as ClientController
} from "../../controllers/users/client/client.users.controller.js";

import {
      validateLogin,
      validateUserToRegister,
      validateBasicData,
      validateAddressData,
      limitShippingAddress,
      limitBillingAddress
} from "../../middlewares/validations/users/users.validations.middleware.js";

import {
      loadUserByJWT as loadByJWT
} from "../../middlewares/loads/users/loadsUsers.middleware.js";

import {
      authMiddleware,
      authFromCookieMiddleware as authFromCookie,
      authKeyMiddleware as authKey
} from "../../middlewares/auth/auth.middleware.js";

import newsletterRouter from "./newsletter/newsletter.users.routes.js";

const clientController = new ClientController();

const usersRouter = Router();

/* Funciones de cliente */
/* ------------------------- */
usersRouter.post("/register", validateUserToRegister, clientController.createOne.bind(clientController));

usersRouter.post("/login", validateLogin, clientController.loginOne.bind(clientController));

usersRouter.get("/checkSession", authFromCookie, loadByJWT, clientController.checkSession.bind(clientController));

usersRouter.get("/logout", authFromCookie, clientController.logout.bind(clientController));

usersRouter.get("/sendResetEmail", authFromCookie, loadByJWT, clientController.sendResetEmail.bind(clientController));

usersRouter.get("/resetEmail/:key", authKey, clientController.resetEmail.bind(clientController));

usersRouter.put("/updateOne/basicInfo", authMiddleware, validateBasicData, loadByJWT, clientController.updateBasicInfo.bind(clientController));

usersRouter.put("/updateOne/add/shipping_addresses", authMiddleware, validateAddressData, loadByJWT, limitShippingAddress, clientController.addAddressGeneric.bind(clientController));

usersRouter.put("/updateOne/add/billing_address", authMiddleware, validateAddressData, loadByJWT, limitBillingAddress, clientController.addAddressGeneric.bind(clientController));

usersRouter.put("/updateOne/delete/:type/:aId", authMiddleware, loadByJWT, clientController.deleteAddressGeneric.bind(clientController));

usersRouter.delete("/deleteOne", authMiddleware, clientController.deleteOne.bind(clientController));
/* ------------------------- */

/* Funciones venta por mayor */
usersRouter.post("/sendWholeSales", clientController.sendWholeSales.bind(clientController));
/* ------------------------- */

/* Funciones de newsletter */
/* ------------------------- */
usersRouter.use("/newsletter", newsletterRouter);

export default usersRouter;