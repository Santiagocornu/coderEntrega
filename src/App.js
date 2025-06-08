import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
app.use(express.json());

const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json");

// Rutas Productos
app.get("/", (req, res) => {
  res.json({ message: "Product & Cart Manager Home" });
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    if (products && products.length > 0) {
      res.status(200).json({ status: "success", products });
    } else {
      res.status(200).json({ status: "success", message: "no hay productos" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "error al obtener los productos" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const newProduct = req.body;
    await productManager.addProduct(newProduct);
    const products = await productManager.getProducts();
    res.status(201).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al postear el producto",
      error: error.message,
    });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const idProduct = req.params.id;
    const updatedProduct = req.body;

    if (
      !updatedProduct.title ||
      typeof updatedProduct.title !== "string" ||
      !updatedProduct.price ||
      typeof updatedProduct.price !== "number"
    ) {
      const error = new Error(
        "Faltan campos obligatorios o tienen formato incorrecto. Se requiere 'title' (string) y 'price' (number)."
      );
      error.statusCode = 400;
      throw error;
    }

    await productManager.updateProductById(idProduct, updatedProduct);
    const products = await productManager.getProducts();

    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al actualizar el producto",
    });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    await productManager.deleteProductById(productId);
    res.status(200).json({ status: "success", message: `Se eliminó el producto con id ${productId}` });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message || "Error al eliminar el producto por id" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productManager.getProductById(productId);
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message || "Error al obtener el producto por id" });
  }
});


app.post("/api/carts", async (req, res) => {
  try {
    const newCart = await cartManager.addCart(); 
    res.status(201).json({ status: "success", cart: newCart });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear el carrito",
      error: error.message,
    });
  }
});


app.get("/api/carts/:cid", async (req, res) => {
  try {
    const cid = Number(req.params.cid); 
    const cart = await cartManager.getCartById(cid);
    res.status(200).json({ status: "success", products: cart.products });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message || "Carrito no encontrado",
    });
  }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);
    const { quantity } = req.body; 

    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
    res.status(200).json({ status: "success", cart: updatedCart });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al agregar producto al carrito",
      error: error.message,
    })
  }
})



app.get("/api/carts", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    if (carts && carts.length > 0) {
      res.status(200).json({ status: "success", carts });
    } else {
      res.status(200).json({ status: "success", message: "No hay carritos" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los carritos", error: error.message });
  }
});


app.delete("/api/carts/:cid", async (req, res) => {
  try {
    const cid = Number(req.params.cid);
    await cartManager.deleteCartById(cid);
    res.status(200).json({ status: "success", message: `Se eliminó el carrito con id ${cid}` });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message || "Error al eliminar el carrito" });
  }
});

app.listen(8080, () => {
  console.log("Servidor iniciado en el puerto 8080");
});
