import {
      UsersDAO
} from "./users/users.dao.js";
import {
      NewsletterDAO
} from "./users/newsletter/newsletter.dao.js";

import {
      ProductsDAO
} from "./products/products.dao.js";
import {
      CategoriesDAO
} from "./products/categories/categories.dao.js";

const DAOs = {
      users: new UsersDAO(),
      newsletter: new NewsletterDAO(),
      products: new ProductsDAO(),
      categories: new CategoriesDAO()
};

export default DAOs;