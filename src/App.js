import express from "express";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { connectDB } from "./db.js";
import ProductManagerMongo from "./ProductManagerMongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer);

// Conectar a MongoDB
connectDB();

// Instancia de ProductManager usando Mongo
const productManager = new ProductManagerMongo();

// Configuración Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// —— RUTAS DE VISTAS ——
app.use("/", viewsRouter);

// —— RUTAS DE PRODUCTOS INLINE ——

// Renderizar listado en /api/products/view
app.get("/api/products/view", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

// PUT /api/products/:pid → actualizar y devolver producto
app.put("/api/products/:pid", async (req, res) => {
  const id = req.params.pid;
  console.log("ID recibido:", id);
  try {
    const updated = await productManager.updateProductById(id, req.body);
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });

    const products = await productManager.getProducts();
    io.emit("updateProducts", products);

    res.json({
      message: "Producto actualizado correctamente",
      product: updated,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: error.message });
  }
});

// —— RUTAS DE CARRITOS ——
app.use("/api/carts", cartsRouter);

// —— WEBSOCKETS ——
io.on("connection", async (socket) => {
  console.log("Cliente conectado por WebSocket");
  try {
    const products = await productManager.getProducts();
    socket.emit("updateProducts", products);
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
  }

  socket.on("addProduct", async (productData) => {
    await productManager.addProduct(productData);
    const updatedProducts = await productManager.getProducts();
    io.emit("updateProducts", updatedProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProductById(id);
    const updatedProducts = await productManager.getProducts();
    io.emit("updateProducts", updatedProducts);
  });
});

// Arrancar servidor
httpServer.listen(8080, () => {
  console.log("Servidor escuchando en puerto 8080");
});
