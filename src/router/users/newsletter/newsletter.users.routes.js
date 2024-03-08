import {
      Router
} from "express";

import {
      NewsletterController
} from "../../../controllers/users/newsletter/newsletter.users.controller.js";

import {
      authMiddleware
} from "../../../middlewares/auth/auth.middleware.js";

import {
      loadUserByJWT as loadByJWT
} from "../../../middlewares/loads/users/loadsUsers.middleware.js";

const newsletterController = new NewsletterController();

const newsletterRouter = Router();

/* Funciones de cliente */
/* ------------------------- */
newsletterRouter.post("/suscribe/noRegisted", newsletterController.suscribeNoRegisted.bind(newsletterController));

newsletterRouter.post("/suscribe/registed", authMiddleware, loadByJWT, newsletterController.suscribeRegisted.bind(newsletterController));

newsletterRouter.put("/unsuscribe", authMiddleware, loadByJWT, newsletterController.unsuscribe.bind(newsletterController));

export default newsletterRouter;