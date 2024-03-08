import usersModel from "../../schemas/users.schema.js";
export class UsersDAO {

      async getOneById(id) {

            try {

                  const user = await usersModel.findById(id).lean();

                  return user;


            } catch (error) {

                  throw {
                        statusCode: 404,
                        message: "Error al obtener el usuario",
                        errors: error
                  }

            }

      }

      async getOneByEmail(email) {

            try {

                  const user = await usersModel.findOne({
                        email
                  }).lean();

                  if (!user) throw {
                        statusCode: 404,
                        message: "Error al obtener el usuario",
                        errors: ["El email ingresado no se encuentra registrado"]
                  }

                  return user;

            } catch (error) {

                  throw {
                        statusCode: 404,
                        message: "Error al obtener el usuario",
                        errors: error.errors
                  }

            }

      }

      async addOne(user) {

            try {

                  const newUser = await usersModel.create(user);

                  return newUser;

            } catch (error) {

                  if (error.code === 11000) {

                        throw {
                              statusCode: 400,
                              message: "Error al crear el usuario",
                              errors: ["El email ingresado ya se encuentra registrado"]
                        }

                  }

                  throw {
                        statusCode: 404,
                        message: "Error al crear el usuario",
                        errors: error
                  }

            }

      };

      async updateOne(id, user) {

            try {

                  const updatedUser = await usersModel.findByIdAndUpdate(id, user, {
                        new: true
                  });

                  return updatedUser;

            } catch (error) {

                  throw {
                        statusCode: 404,
                        message: "Error al actualizar el usuario",
                        errors: error
                  }

            }

      };

      async deleteOne(id) {

            try {

                  const deletedUser = await usersModel.findByIdAndDelete(id);

                  return deletedUser;

            } catch (error) {

                  throw {
                        statusCode: 404,
                        message: "Error al eliminar el usuario",
                        errors: error
                  }

            }

      };

}