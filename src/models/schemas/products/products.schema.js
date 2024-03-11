import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import CONFIG from "../../../environments/config.js";

const categoriesCollection = CONFIG.MONGO_COLLECTIONS.categories;

const productsCollection = CONFIG.MONGO_COLLECTIONS.products;

const productVariantSchema = new mongoose.Schema({
      size: {
            type: String,
            required: true,
      },
      color: {
            type: String,
            required: true,
      },
      stock: {
            type: Number,
            required: true,
            min: 0,
      },
      images: [{
            type: String,
            required: true,
      }],
});

const productSizeSchema = new mongoose.Schema({
      size: {
            type: String,
            required: true,
      },
      variants: [productVariantSchema], // Array de variantes, combinando color y stock
}, {
      _id: false
});

const productsSchema = new mongoose.Schema({
      title: {
            type: String,
            required: true,
      },
      description: {
            type: String,
            required: true,
      },
      code: {
            type: String,
            required: true,
            unique: true, // Asegura que el código del producto sea único
      },
      price: {
            type: Number,
            required: true,
      },
      status: {
            type: Boolean,
            required: true,
            default: true,
      },
      images: [{
            type: String,
            required: true,
      }],
      sizes: [productSizeSchema], // Usa el esquema de tamaño aquí
      category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: categoriesCollection,
            required: true,
      },

});

productsSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;