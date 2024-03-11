import productsModel from "../../schemas/products/products.schema.js";

export class ProductsDAO {

      async getProductById(id) {

            try {

                  const product = await productsModel.findById(id).populate('category').lean();

                  return product;

            } catch (error) {

                  throw {
                        statusCode: 404,
                        message: "Error al obtener el producto",
                        errors: error
                  };

            }

      }

      async getAllProducts(filterOptions = {}, options = {}) {
            try {

                  const products = await productsModel.paginate(filterOptions, {
                        ...options,
                        populate: 'category',
                        lean: true,
                  });

                  return products;
            } catch (error) {
                  throw {
                        statusCode: 404,
                        message: "Error al obtener los productos",
                        errors: error
                  };
            }
      }

}