import CONFIG from "../../environments/config.js";
import {
      verifyJWT
} from "../../utils/JWT/jwt.utils.js";

import {
      compareHash
} from "../../utils/bcrypt/bcrypt.utils.js";

import AuthError from "../../services/errors/authorizationError.js";
import InvalidError from "../../services/errors/invalidError.js";

import {
      UserService
} from "../../services/users/users.services.js";

const userService = new UserService();

export const authMiddleware = (req, res, next) => {

      const authHeader = req.headers['authorization'];

      if (!authHeader) {

            throw new AuthError(["El header de autorización es requerido"]);
      }

      const token = authHeader.split(' ')[1];

      if (!token) {

            throw new AuthError(["El token es requerido"]);

      }

      try {

            const decoded = verifyJWT(token);

            req._id = decoded;

            next();

      } catch (error) {
            throw new InvalidError(["El token no es valido"]);
      }


}

export const authFromCookieMiddleware = (req, res, next) => {

      try {

            const token = req.cookies.token;

            if (!token) {

                  throw new AuthError(["No se ha encontrado el token en las cookies"]);


            }

            req.token = token;



            const decoded = verifyJWT(token);

            if (!decoded) {
                  throw new InvalidError(["El token no es valido"]);

            }

            req._id = decoded;

            req.token = token;

            next();

      } catch (error) {
            throw new AuthError(["No se ha podido verificar el token"]);
      }

}

export const authKeyMiddleware = async (req, res, next) => {

      try {

            const token = req.cookies.token;

            if (!token) {

                  throw new AuthError(["No se ha encontrado el token en las cookies"]);

            }

            const {
                  key
            } = req.params;

            if (!key) {

                  throw new AuthError(["No se ha encontrado el key en los parametros"]);

            }

            const decoded = verifyJWT(token);

            if (!decoded) {

                  throw new InvalidError(["El token no es valido"]);

            }

            const user = await userService.loadUser(decoded);

            if (!user) {

                  throw new InvalidError(["El usuario no existe"]);

            }

            const result = compareHash(user.password, key);

            if (!result) {

                  throw new InvalidError(["El key no es valido"]);

            }

            req.result = result;

            req.key = key;

            req.token = token;

            next();

      } catch (error) {
            throw new AuthError(["No se ha podido verificar el token"]);
      }

}