import mongoose from "mongoose";
import CONFIG from "../../../../environments/config.js";

const categoriesCollection = CONFIG.MONGO_COLLECTIONS.categories;

const categoriesSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      parentName: {
            type: String,
            default: null, // null para categorías principales
      },
      parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: categoriesCollection,
            default: null, // null para categorías principales
      },
});

const categoryModel = mongoose.model(categoriesCollection, categoriesSchema);

export default categoryModel;