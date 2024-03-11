import Router from "express";

import {
      UserController
} from "../../controllers/users/users.controller.js";

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

const userController = new UserController();

const usersRouter = Router();

/* Funciones de cliente */
/* ------------------------- */
usersRouter.post("/register", validateUserToRegister, userController.createOne.bind(userController));

usersRouter.post("/login", validateLogin, userController.loginOne.bind(userController));

usersRouter.get("/checkSession", authFromCookie, loadByJWT, userController.checkSession.bind(userController));

usersRouter.get("/logout", authFromCookie, userController.logout.bind(userController));

usersRouter.get("/sendResetEmail", authFromCookie, loadByJWT, userController.sendResetEmail.bind(userController));

usersRouter.get("/resetEmail/:key", authKey, userController.resetEmail.bind(userController));

usersRouter.put("/updateOne/basicInfo", authMiddleware, validateBasicData, loadByJWT, userController.updateBasicInfo.bind(userController));

usersRouter.put("/updateOne/add/shipping_addresses", authMiddleware, validateAddressData, loadByJWT, limitShippingAddress, userController.addAddressGeneric.bind(userController));

usersRouter.put("/updateOne/add/billing_address", authMiddleware, validateAddressData, loadByJWT, limitBillingAddress, userController.addAddressGeneric.bind(userController));

usersRouter.put("/updateOne/delete/:type/:aId", authMiddleware, loadByJWT, userController.deleteAddressGeneric.bind(userController));

usersRouter.delete("/deleteOne", authMiddleware, userController.deleteOne.bind(userController));
/* ------------------------- */

/* Funciones venta por mayor */
usersRouter.post("/sendWholeSales", userController.sendWholeSales.bind(userController));
/* ------------------------- */

/* Funciones de newsletter */
/* ------------------------- */
usersRouter.use("/newsletter", newsletterRouter);

export default usersRouter;