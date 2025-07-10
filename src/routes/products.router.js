import { Router } from "express";
import ProductManager from "../ProductManager.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(path.join(__dirname, "../data/products.json"));

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/api/products", async (req, res) => {
  const products = await productManager.getProducts();
  res.json({ products });
});

router.post("/api/products", async (req, res) => {
  await productManager.addProduct(req.body);
  const products = await productManager.getProducts();
  res.json({ products });
});

router.delete("/api/products/:pid", async (req, res) => {
  await productManager.deleteProductById(req.params.pid);
  res.json({ message: "Producto eliminado" });
});

export default router;
