import NewsletterModel from "../../../schemas/users/newsletter/newsletter.schema.js";

export class NewsletterDAO {

      async getOne(email) {

            try {

                  const user = await NewsletterModel.findOne({
                        email
                  }).lean();

                  return user;

            } catch (error) {

                  throw {
                        statusCode: 404,
                        message: "Error al obtener el usuario ingresado",
                        errors: error
                  }

            }

      }

      async getOneById(id) {

            try {

                  const user = await NewsletterModel.findOne({
                        user_id: id
                  }).lean()

                  return user;

            } catch (error) {

                  throw {
                        statusCode: 404,
                        message: "Error al obtener el usuario ingresado",
                        errors: error
                  }

            }

      }

      async addOneNoRegisted(email) {

            try {

                  const newUser = new NewsletterModel({
                        email
                  });

                  await newUser.save();

                  return {
                        email
                  };

            } catch (error) {

                  throw error;

            }

      }



      async addOneRegisted(email, user_id) {

            try {

                  const newUser = new NewsletterModel({
                        email,
                        user_id
                  });

                  await newUser.save();

                  return {
                        email
                  };

            } catch (error) {

                  throw error;

            }

      }

      async updateIsSuscribed(email, status) {

            try {

                  const user = await NewsletterModel.findOneAndUpdate({
                        email
                  }, {
                        is_subscribed: status
                  }, {
                        new: true
                  });

                  return user;

            } catch (error) {

                  throw error;

            }

      }

      async updateRegisted(email, user_id, status) {

            try {

                  const user = await NewsletterModel.findOneAndUpdate({
                        email
                  }, {
                        user_id
                  }, {
                        is_subscribed: status
                  }, {
                        new: true
                  });

                  return user;

            } catch (error) {

                  throw error;

            }

      }



}