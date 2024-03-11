import Router from 'express'

import {
      ProductController
} from '../../controllers/products/products.controller.js'

const productController = new ProductController()

const productsRouter = Router()

productsRouter.get('/getOne/:productId', productController.getProductById.bind(productController))

productsRouter.get('/getAll', productController.getAllProducts.bind(productController))

export default productsRouter