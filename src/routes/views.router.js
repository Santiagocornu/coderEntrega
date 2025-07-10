import { Router } from "express";
import ProductManager from "../ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";
import CartManager from "../CartManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
const productManager = new ProductManager(path.join(__dirname, "../data/products.json"));
const cartManager = new CartManager(path.join(__dirname, "../data/carts.json"));

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

router.get("/cartsview", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.render("carts", { carts });
  } catch (error) {
    res.status(500).send("Error al cargar carritos");
  }
});

export default router;
