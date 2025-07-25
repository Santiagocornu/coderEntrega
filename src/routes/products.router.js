import { Router } from "express";
import ProductManagerMongo from "../ProductManagerMongo.js";

const router = Router();
const productManager = new ProductManagerMongo();

// Ruta para renderizar la vista "home" con productos desde Mongo
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

// GET /api/products: devuelve todos los productos en JSON crudo
router.get("/api/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const products = await productManager.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
    });

    res.json(products); // devuelve el objeto con docs, totalPages, etc.
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// POST /api/products: agrega un nuevo producto
router.post("/api/products", async (req, res) => {
  await productManager.addProduct(req.body);
  const products = await productManager.getProducts();
  res.json(products);
});

// DELETE /api/products/:pid: elimina por _id de Mongo
router.delete("/api/products/:pid", async (req, res) => {
  const id = req.params.pid;
  await productManager.deleteProductById(id);
  res.json({ message: "Producto eliminado" });
});
// PUT /api/products/:pid: actualiza un producto existente
router.put("/api/products/:pid", async (req, res) => {
  const id = req.params.pid;
  const updatedFields = req.body;
console.log("ID recibido:", id);
  try {
    const updatedProduct = await productManager.updateProductById(id, updatedFields);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({
      message: "Producto actualizado correctamente",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error.message);
    res.status(500).json({ error: error.message });
  }
});




export default router;
