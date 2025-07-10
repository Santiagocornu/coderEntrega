const socket = io();

const addForm = document.getElementById("addForm");
const productList = document.getElementById("productList");

// Crear producto
addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(addForm);

  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: parseFloat(formData.get("price")),
    status: true,
    stock: parseInt(formData.get("stock")),
    category: formData.get("category"),
    thumbnails: formData.get("thumbnail") ? [formData.get("thumbnail")] : []
  };

  if (
    !product.title || !product.description || !product.code ||
    isNaN(product.price) || isNaN(product.stock) || !product.category
  ) {
    return alert("Por favor completa todos los campos correctamente.");
  }

  socket.emit("addProduct", product);
  addForm.reset();
});

// Eliminar producto con confirmación
productList.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const id = card.dataset.id;
  const confirmDelete = confirm("¿Desea eliminar el producto?");
  if (confirmDelete) {
    socket.emit("deleteProduct", id);
  }
});

// Actualizar lista en tiempo real
socket.on("updateProducts", (products) => {
  productList.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.id = product.id;
    card.innerHTML = `
  <div class="product-image-container">
    <img class="product-image" src="${product.thumbnails?.[0] || 'https://via.placeholder.com/150'}" alt="${product.title}">
  </div>
  <h2 class="product-title">${product.title}</h2>
  <h3 class="product-price">Precio: $${product.price}</h3>
`;

    productList.appendChild(card);
  });
});
