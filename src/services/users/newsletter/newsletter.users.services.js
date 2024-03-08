import DAOs from "../../../models/daos/index.daos.js";


export class NewsletterService {

      async checkSuscribedByEmail(email) {

            try {

                  const result = await DAOs.newsletter.getOne(email);

                  if (!result) return {
                        added: false,
                        suscribed: false
                  };

                  if (result.is_subscribed) return {
                        added: true,
                        email: result.email,
                        user_id: result.user_id,
                        suscribed: true
                  };

                  if (!result.is_subscribed) return {
                        added: true,
                        email: result.email,
                        user_id: result.user_id,
                        suscribed: false
                  };

                  return {
                        added: false,
                        suscribed: false
                  };

            } catch (error) {

                  throw error;

            }

      }

      async checkSuscribedById(user_id) {

            try {

                  const result = await DAOs.newsletter.getOneById(user_id);

                  if (!result) return {
                        added: false,
                        suscribed: false
                  };

                  if (result.is_subscribed) return {
                        added: true,
                        email: result.email,
                        user_id: result.user_id,
                        suscribed: true
                  };

                  if (!result.is_subscribed) return {
                        added: true,
                        email: result.email,
                        user_id: result.user_id,
                        suscribed: false
                  };

                  return {
                        added: false,
                        suscribed: false
                  };

            } catch (error) {

                  throw error;

            }

      }

      async updateIsSuscribed(email, isSuscribed) {

            try {

                  const result = await DAOs.newsletter.updateIsSuscribed(email, isSuscribed);

                  return result;

            } catch (error) {

                  throw error;


            }

      }

      async suscribeNoRegisted(email) {

            try {

                  const checkSuscription = await this.checkSuscribedByEmail(email);

                  if (checkSuscription.suscribed) {

                        throw {
                              statusCode: 400,
                              message: "Error al suscribirse",
                              errors: ["El email ingresado ya se encuentra suscripto"]
                        }

                  }

                  if (checkSuscription.added && !checkSuscription.suscribed) {

                        const result = await this.updateIsSuscribed(email, true);

                        return result;

                  }

                  if (!checkSuscription.added) {

                        const result = await DAOs.newsletter.addOneNoRegisted(email);

                        return result;

                  }

            } catch (error) {

                  throw error;

            }

      }

      async updateRegisted(email, user_id) {

            try {

                  const updatedNewsletter = await DAOs.newsletter.updateRegisted(email, user_id);

                  if (updatedNewsletter && updatedNewsletter.user_id !== user_id) throw {
                        statusCode: 500,
                        message: "Error al suscribirse",
                        errors: ["Error al actualizar la información de suscripción"]
                  }

                  const result = await this.updateIsSuscribed(updatedNewsletter.email, true);

                  return result;

            } catch (error) {
                  throw error;
            }

      }

      async suscribeRegisted(email, user_id) {

            try {

                  const checkSuscription = await this.checkSuscribedById(email);

                  if (checkSuscription.suscribed) {

                        throw {
                              statusCode: 400,
                              message: "Error al suscribirse",
                              errors: ["El email ingresado ya se encuentra suscripto"]
                        }

                  }

                  if (checkSuscription.added && !checkSuscription.suscribed) {

                        const result = await this.updateRegisted(email, user_id);

                        return result;

                  }

                  if (!checkSuscription.added) {

                        const result = await DAOs.newsletter.addOneRegisted(email, user_id);

                        return result;

                  }

            } catch (error) {

                  throw error;

            }

      }

      async unsuscribe(email) {

            try {

                  const checkSuscription = await this.checkSuscribedByEmail(email);

                  if (!checkSuscription.suscribed) {

                        throw {
                              statusCode: 400,
                              message: "Error al desuscribirse",
                              errors: ["El email ingresado no se encuentra suscripto"]
                        }

                  }

                  const result = await this.updateIsSuscribed(email, false);

                  return result;

            } catch (error) {

                  throw error;

            }

      }


}