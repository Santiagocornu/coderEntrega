import { Router } from "express";
import CartManager from "../CartManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const router = Router();

const cartManager = new CartManager(path.join(__dirname, "../data/carts.json"));

// Vista de carritos con Handlebars
router.get("/cartsview", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.render("carts", { carts });
  } catch (error) {
    res.status(500).send("Error al cargar carritos");
  }
});

// Obtener todos los carritos (JSON)
router.get("/api/carts", async (req, res) => {
  const carts = await cartManager.getCarts();
  res.json({ carts });
});

// Crear nuevo carrito
router.post("/api/carts", async (req, res) => {
  await cartManager.addCart();
  const carts = await cartManager.getCarts();
  res.json({ carts });
});

// Eliminar carrito
router.delete("/api/carts/:cid", async (req, res) => {
  await cartManager.deleteCartById(req.params.cid);
  res.json({ message: "Carrito eliminado" });
});

export default router;
