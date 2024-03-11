import Router from 'express';

import {
      CategoryController
} from '../../../controllers/products/categories/categories.controller.js';

const categoryController = new CategoryController();

const categoriesRouter = Router();

categoriesRouter.get('/getOne/:categoryId', categoryController.getCategoryById.bind(categoryController));

categoriesRouter.get('/getAll', categoryController.getAllCategories.bind(categoryController));

export default categoriesRouter;