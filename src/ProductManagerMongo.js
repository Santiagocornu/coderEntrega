import { ProductModel } from "./models/Product.model.js";

class ProductManagerMongo {
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
  try {
    const options = {
      limit,
      page,
      lean: true,
      sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
    };

    const filter = query ? { category: query } : {};

    const result = await ProductModel.paginate(filter, options);
    return result;
  } catch (error) {
    throw new Error("No se pudieron obtener los productos: " + error.message);
  }
}


  async addProduct(newProduct) {
    try {
      const requiredFields = ["title", "price", "code"];
      for (const field of requiredFields) {
        if (!newProduct[field]) {
          throw new Error(`Falta el campo obligatorio: ${field}`);
        }
      }

      if (typeof newProduct.price !== "number") {
        throw new Error("El precio debe ser un número");
      }

      const createdProduct = await ProductModel.create(newProduct);
      return createdProduct;
    } catch (error) {
      throw new Error("No se pudo crear el producto: " + error.message);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id).lean();
      if (!product) {
        throw new Error(`No se encontró producto con id ${id}`);
      }
      return product;
    } catch (error) {
      throw new Error("Error al obtener el producto: " + error.message);
    }
  }

  async deleteProductById(id) {
    try {
      const result = await ProductModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error(`No se encontró producto con id ${id}`);
      }
      return result;
    } catch (error) {
      throw new Error("No se pudo eliminar el producto: " + error.message);
    }
  }

  async updateProductById(id, updatedFields) {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    return updatedProduct;
  } catch (error) {
    throw new Error("Error al actualizar el producto: " + error.message);
  }
}


}

export default ProductManagerMongo;
