document.addEventListener("DOMContentLoaded", () => {
  const addForm = document.getElementById("addForm");
  const productList = document.getElementById("productList");

  const socket = io();

  let currentPage = 1;
  const limit = 12;

  // Función para cargar productos usando fetch y mostrar paginación
  async function loadProducts(page = 1) {
    try {
      const res = await fetch(`http://localhost:8080/api/products?limit=${limit}&page=${page}`);
      const data = await res.json();

      if (!data.docs) return;

      productList.innerHTML = "";

      data.docs.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.id = product._id;
        card.innerHTML = `
          <div class="product-image-container">
            <img class="product-image" src="${product.thumbnails?.[0] || 'https://via.placeholder.com/150'}" alt="${product.title}">
          </div>
          <h2 class="product-title">${product.title}</h2>
          <h3 class="product-price">Precio: $${product.price}</h3>
          <button class="delete-btn" data-id="${product._id}">Eliminar</button>
        `;
        productList.appendChild(card);
      });

      // Opcional: aquí podrías agregar controles de paginación si quieres
      // Por simplicidad lo omito, pero si querés te ayudo con eso también

    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  // Carga inicial
  loadProducts(currentPage);

  // Crear producto
  if (addForm) {
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

      // Recargar productos después de agregar
      loadProducts(currentPage);
    });
  }

  // Manejar eliminar producto
  if (productList) {
    productList.addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-btn")) {
        const id = event.target.getAttribute("data-id");
        if (confirm("¿Seguro que querés eliminar este producto?")) {
          socket.emit("deleteProduct", id);
          // Recargar productos después de eliminar
          loadProducts(currentPage);
        }
        return;
      }

      // Click en la tarjeta (excepto botón eliminar) va al editor
      const card = event.target.closest(".product-card");
      if (card && !event.target.classList.contains("delete-btn")) {
        const productId = card.dataset.id;
        if (productId) {
          window.location.href = `/editProduct/${productId}`;
        }
      }
    });
  }

  // Opcional: si querés, escucha eventos socket para actualizar lista en tiempo real
  socket.on("productAdded", () => loadProducts(currentPage));
  socket.on("productDeleted", () => loadProducts(currentPage));
});
