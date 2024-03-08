import {
      Router
} from "express";

import usersRouter from "./users/users.routes.js";


const router = Router();

router.use("/api/users", usersRouter);


export default router;