import {
      ProductService
} from "../../services/products/products.services.js";

const productService = new ProductService();

import {
      successResponse,
      errorResponse
} from "../../utils/responses/responses.utils.js";

export class ProductController {

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

      async getProductById(req, res) {

            try {

                  const {
                        productId
                  } = req.params;

                  const product = await productService.getProductById(productId);

                  this.formattedSuccessRes(res, 200, "Producto encontrado", product);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

      async getAllProducts(req, res) {

            try {

                  const {
                        page,
                        limit,
                        category
                  } = req.query;

                  const products = await productService.getAllProducts(page, limit, category);

                  this.formattedSuccessRes(res, 200, "Productos obtenidos correctamente", products);

            } catch (error) {

                  this.formattedErrorRes(res, error.statusCode, error.message, error.errors);

            }

      }

}