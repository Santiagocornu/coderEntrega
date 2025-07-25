import { CartModel } from "./models/Carts.model.js";
import { ProductModel } from "./models/Product.model.js";

export class CartManagerMongo {
  constructor() {}

  async createCart() {
    const newCart = new CartModel({ products: [] });
    await newCart.save();
    return newCart;
  }

  async getCartById(cid) {
    const cart = await CartModel.findById(cid).populate("products.product").lean();
    if (!cart) throw new Error("Carrito no encontrado");
    return cart;
  }

  async getAllCarts() {
    const carts = await CartModel.find().populate("products.product").lean();
    return carts;
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    await cart.save();
    return cart;
  }

  async deleteProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    if (quantity < 1) throw new Error("La cantidad debe ser mayor o igual a 1");

    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (!productInCart) throw new Error("Producto no encontrado en carrito");

    productInCart.quantity = quantity;
    await cart.save();
    return cart;
  }

  async updateAllProducts(cid, products) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    if (!Array.isArray(products)) throw new Error("El parámetro products debe ser un arreglo");

    cart.products = products.map(({ product, quantity }) => ({
      product,
      quantity,
    }));
    await cart.save();
    return cart;
  }

  async deleteAllProducts(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    await cart.save();
    return cart;
  }
}
