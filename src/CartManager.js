import fs from "fs";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId(carts) {
    return carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
  }

  async getCarts() {
    try {
      const cartsRaw = await fs.promises.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(cartsRaw);
      return carts;
    } catch (error) {
      throw new Error("No se pudieron obtener los carritos: " + error.message);
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const numericId = Number(id);
      const cart = carts.find(c => c.id === numericId);
      if (!cart) {
        throw new Error(`No se encontró carrito con id ${numericId}`);
      }
      return cart;
    } catch (error) {
      throw new Error("No se pudo obtener el carrito: " + error.message);
    }
  }

  async addCart() {
    try {
      const carts = await this.getCarts();
      const newCart = {
        id: this.generateNewId(carts),
        products: []
      };
      carts.push(newCart);
      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
      return newCart;
    } catch (error) {
      throw new Error("No se pudo crear el carrito: " + error.message);
    }
  }

  async deleteCartById(id) {
    try {
      const carts = await this.getCarts();
      const numericId = Number(id);
      const index = carts.findIndex(c => c.id === numericId);
      if (index === -1) {
        throw new Error(`No se encontró carrito con id ${numericId}`);
      }
      carts.splice(index, 1);
      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
    } catch (error) {
      throw new Error("No se pudo eliminar el carrito: " + error.message);
    }
  }

  async updateCart(id, updatedCart) {
    try {
      const carts = await this.getCarts();
      const numericId = Number(id);
      const index = carts.findIndex(c => c.id === numericId);
      if (index === -1) {
        throw new Error(`No se encontró carrito con id ${numericId}`);
      }
      carts[index] = { id: numericId, ...updatedCart }; // mantiene el id original
      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
      return carts[index];
    } catch (error) {
      throw new Error("No se pudo actualizar el carrito: " + error.message);
    }
  }

 async addProductToCart(cartId, productId, quantity ) {
  try {
    const carts = await this.getCarts();
    const numericCartId = Number(cartId);
    const numericProductId = Number(productId);
    const qty = Number(quantity);

    if (isNaN(qty) || qty <= 0) {
      throw new Error("La cantidad debe ser un número positivo");
    }

    const cartIndex = carts.findIndex(c => c.id === numericCartId);
    if (cartIndex === -1) {
      throw new Error(`No se encontró carrito con id ${numericCartId}`);
    }

    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.product === numericProductId);

    if (productIndex === -1) {
      cart.products.push({ product: numericProductId, quantity: qty });
    } else {
      cart.products[productIndex].quantity += qty;
    }

    carts[cartIndex] = cart;
    await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");

    return cart;
  } catch (error) {
    throw new Error("No se pudo agregar el producto al carrito: " + error.message);
  }
}

}

export default CartManager;
