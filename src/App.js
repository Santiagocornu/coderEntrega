import express from "express";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer);

const productManager = new ProductManager(path.join(__dirname, "./data/products.json"));

// Configuración Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routers
app.use("/", viewsRouter);
app.use("/", productsRouter);
app.use("/", cartsRouter);


// Websocket
io.on("connection", async (socket) => {
  console.log("Cliente conectado");
  socket.emit("updateProducts", await productManager.getProducts());

  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);
    io.emit("updateProducts", await productManager.getProducts());
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProductById(id);
    io.emit("updateProducts", await productManager.getProducts());
  });
});

httpServer.listen(8080, () => {
  console.log("Servidor escuchando en puerto 8080");
});
