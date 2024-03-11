import {
      CategoryService
} from "../../../services/products/categories/categories.services.js";

import {
      successResponse,
      errorResponse
} from "../../../utils/responses/responses.utils.js";

const categoryService = new CategoryService();

export class CategoryController {

      constructor() {

            this.formattedSuccessRes = this.formattedSuccessRes.bind(this);

            this.formattedErrorRes = this.formattedErrorRes.bind(this);

      }

      formattedSuccessRes(res, statusCode, message, payload) {

            const response = successResponse(statusCode, message, payload);

            res.status(statusCode).json(response);

      }

      formattedErrorRes(res, statusCode, message, error) {

            const response = errorResponse(statusCode ? statusCode : 500, message, error);

            res.status(statusCode ? statusCode : 500).json(response);

      }

      async getCategoryById(req, res) {

            try {

                  const {
                        categoryId
                  } = req.params;

                  const category = await categoryService.getCategoryById(categoryId);

                  this.formattedSuccessRes(res, 200, "Categoría encontrada", category);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async getAllCategories(req, res) {

            try {

                  const categories = await categoryService.getAllCategories();

                  this.formattedSuccessRes(res, 200, "Categorías obtenidas correctamente", categories);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

}