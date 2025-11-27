# 🛍️ E-Commerce Backend (Coder Entrega)

Proyecto desarrollado como parte del curso de **Programación Backend en Coderhouse**, con el objetivo de construir un servidor de E-commerce funcional utilizando **Node.js**, **Express** y **MongoDB**, incluyendo comunicación en tiempo real mediante **WebSockets**.

---

## 🌟 Características Principales

- **API RESTful Completa:** Gestión de productos y carritos de compra con rutas HTTP (`GET`, `POST`, `PUT`, `DELETE`).
- **Persistencia con MongoDB:** Uso de **Mongoose** para manejar datos de forma persistente.
- **Paginación:** Implementación de `mongoose-paginate-v2` para manejar grandes conjuntos de datos de productos.
- **WebSockets (Socket.io):** Comunicación bidireccional en tiempo real para mantener la lista de productos actualizada automáticamente en el frontend.
- **Vistas Dinámicas (Handlebars):** Renderizado de interfaz con **Express Handlebars**.
- **Patrón Repository/Manager:** Código modular que separa la lógica de negocio (Managers) de la lógica de enrutamiento.

---

## ⚙️ Tecnologías Utilizadas

- **Lenguaje:** JavaScript  
- **Entorno:** Node.js  
- **Framework Web:** Express  
- **Base de Datos:** MongoDB (a través de Mongoose)  
- **Tiempo Real:** Socket.io  
- **Motor de Plantillas:** Express Handlebars  

### Dependencias Clave

| Dependencia | Descripción |
|------------|-------------|
| express | Servidor web principal |
| mongoose | ODM para interactuar con MongoDB |
| mongoose-paginate-v2 | Facilita la paginación de resultados |
| socket.io | Comunicación en tiempo real (WebSockets) |
| express-handlebars | Motor de plantillas para renderizar vistas |

---

## 🚀 Puesta en Marcha

### 1. Requisitos Previos

- Node.js (v18.x o superior)  
- Instancia de MongoDB local o URI de conexión válida

### 2. Instalación

```bash
git clone https://github.com/Santiagocornu/coderEntrega.git
cd coderEntrega
npm install
```

### 3. Configuración de la Base de Datos

En `db.js`:

```javascript
const MONGO_URL = "mongodb://127.0.0.1:27017/ecommerce";
```

> Modifica la URL si tu base de datos está en otro host o puerto.

### 4. Ejecución del Servidor

```bash
npm start   # o node index.js si no hay script start
```

El servidor se iniciará en el **puerto 8080** y mostrará:

```
Servidor escuchando en puerto 8080
MongoDB conectado con éxito
```

---

## 🗺️ Endpoints Clave

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/products/view | Renderiza la vista home con productos de MongoDB |
| PUT | /api/products/:pid | Actualiza un producto por ID y emite la actualización por WebSocket |
| GET | /api/carts | Lista todos los carritos |
| POST | /api/carts | Crea un nuevo carrito |

### WebSockets

- Conectar al puerto 8080
- Escuchar el evento `updateProducts` para recibir la lista actualizada de productos tras cualquier operación

---

## 🗂️ Estructura del Código

- **app.js / index.js:** Configuración de Express, Socket.io, Handlebars y rutas  
- **db.js:** Conexión a MongoDB  
- **ProductManagerMongo.js:** Lógica de negocio para productos con paginación  
- **CartManagerMongo.js:** Lógica de negocio para carritos  
- **CartManager.js:** Basado en lectura/escritura de archivos (no utilizado por app.js)  

---
