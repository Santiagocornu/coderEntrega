import { Router } from "express";
import { CartManagerMongo } from "../CartManagerMongo.js";
const router = Router();
const cartManager = new CartManagerMongo();

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito por id con productos poblados
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Crear nuevo carrito vacío
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error creando carrito" });
  }
});

// Eliminar carrito completo
router.delete("/:cid", async (req, res) => {
  try {
    await cartManager.deleteAllProducts(req.params.cid);
    res.json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Eliminar producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Actualizar TODOS los productos del carrito con arreglo de productos
router.put("/:cid", async (req, res) => {
  try {
    const products = req.body.products; // espera [{ product: "id", quantity: n }, ...]
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "El body debe contener un arreglo 'products'" });
    }
    const cart = await cartManager.updateAllProducts(req.params.cid, products);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Actualizar SOLO la cantidad de un producto específico en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ error: "Debe enviar una cantidad válida (número >= 1)" });
    }
    const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
