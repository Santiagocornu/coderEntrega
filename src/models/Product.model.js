import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  code: String,
  stock: Number,
  category: String,
  thumbnails: [String],
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model("Product", productSchema);
