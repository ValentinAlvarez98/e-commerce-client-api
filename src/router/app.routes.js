import {
      Router
} from "express";

import usersRouter from "./users/users.routes.js";

import productsRouter from "./products/products.routes.js";

import categoriesRouter from "./products/categories/categories.routes.js";


const router = Router();

router.use("/api/users", usersRouter);

router.use("/api/products", productsRouter);

router.use("/api/categories", categoriesRouter);


export default router;