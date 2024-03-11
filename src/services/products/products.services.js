import DAOs from "../../models/daos/index.daos.js";

import {
      CategoryService
} from "./categories/categories.services.js";

import CONFIG from "../../environments/config.js";

const categoryService = new CategoryService();

export class ProductService {

      async getProductById(productId) {

            try {

                  const product = await DAOs.products.getProductById(productId);

                  if (!product) {

                        throw {
                              statusCode: 404,
                              message: "Producto no encontrado",
                              errors: ["El producto solicitado no existe"],
                        };

                  }

                  return product;

            } catch (error) {

                  throw error;

            }

      }


      async getAllProducts(page = 1, limit = 10, category = null) {

            try {

                  let filterOptions = {};

                  if (category) {

                        const categoryHierarchyIds = await categoryService.getCategoryHierarchy(category);

                        filterOptions.category = {
                              $in: categoryHierarchyIds
                        };

                  }

                  const options = {
                        page,
                        limit,
                        populate: 'category',
                  };

                  const result = await DAOs.products.getAllProducts(filterOptions, options);

                  return result;

            } catch (error) {

                  throw error;

            }

      }

}