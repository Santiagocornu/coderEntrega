import { Router } from "express";
import ProductManagerMongo from "../ProductManagerMongo.js"; 
import path from "path";
import { fileURLToPath } from "url";
import { CartManagerMongo } from "../CartManagerMongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
const productManager = new ProductManagerMongo();
const cartManager = new CartManagerMongo();

// Renderizar home con productos (para Handlebars, procesados para vista)
router.get("/", async (req, res) => {
  try {
    const productsFromDB = await productManager.getProducts();

    const products = productsFromDB.docs.map(p => ({
      ...p,
      thumbnail: (p.thumbnails && p.thumbnails.length > 0) ? p.thumbnails[0] : 'default.jpg',
      id: p._id.toString()
    }));

    res.render("home", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener productos desde DB");
  }
});


// Renderizar realtimeproducts (igual que home)
router.get("/realtimeproducts", async (req, res) => {
  try {
    // Obtenemos la paginación con docs
    const productsFromDB = await productManager.getProducts();

    // Mapear solo los productos (docs), para agregar thumbnail e id string
    const products = productsFromDB.docs.map(p => ({
      ...p,
      thumbnail: (p.thumbnails && p.thumbnails.length > 0) ? p.thumbnails[0] : 'default.jpg',
      id: p._id.toString()
    }));

    // Renderizar con productos ya mapeados
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener productos desde DB");
  }
});


// GET /editProduct/:id → renderiza formulario de edición
router.get("/editProduct/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const product = await productManager.getProductById(id);
    if (!product) return res.status(404).send("Producto no encontrado");

    res.render("editProduct", { product }); 

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el producto");
  }
});



// Devolver JSON crudo con todos los productos sin procesamiento
router.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/cartsview", async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.render("carts", { carts });
  } catch (error) {
    res.status(500).send("Error al cargar carritos");
  }
});

export default router;
