import DAOs from "../../../models/daos/index.daos.js";

export class CategoryService {

      async getCategoryById(categoryId) {

            try {

                  const category = await DAOs.categories.getCategoryById(categoryId);

                  if (!category) {

                        throw {
                              statusCode: 404,
                              message: "Categoría no encontrada",
                              errors: ["La categoría solicitada no existe"],
                        };

                  }

                  return category;

            } catch (error) {

                  throw error;

            }

      }

      async getCategoryHierarchy(categoryId) {

            const allCategories = await DAOs.categories.getAllCategories();

            let hierarchyIds = [categoryId];

            function findSubcategories(parentId) {

                  allCategories.forEach(category => {

                        if (category.parentCategory && category.parentCategory.toString() === parentId) {

                              hierarchyIds.push(category._id.toString());

                              findSubcategories(category._id.toString());

                        }

                  });

            }

            findSubcategories(categoryId);

            return hierarchyIds;

      }

      async getAllCategories() {

            try {

                  const categories = await DAOs.categories.getAllCategories();

                  return categories;

            } catch (error) {

                  throw error;

            }

      }

}