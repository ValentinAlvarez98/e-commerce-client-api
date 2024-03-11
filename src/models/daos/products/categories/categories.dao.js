import categoryModel from "../../../schemas/products/categories/categories.schema.js";

export class CategoriesDAO {
      async getCategoryById(id) {

            try {

                  const category = await categoryModel.findById(id).lean();

                  return category;

            } catch (error) {

                  throw {
                        statusCode: 404,
                        message: "Error al obtener la categoría",
                        errors: error
                  };

            }

      };

      async getAllCategories(filter = {}) {

            try {

                  const categories = await categoryModel.find(filter).lean();

                  return categories;

            } catch (error) {

                  throw {
                        statusCode: 404,
                        message: "Error al obtener las categorías",
                        errors: error
                  };

            }

      }

};