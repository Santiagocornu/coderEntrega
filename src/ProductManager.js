import fs from 'fs'
class ProductManager {
    constructor(pathFile){
        this.pathFile=pathFile;
    } 
    generateNewId(products) {
    return products.length > 0 
        ? products[products.length - 1].id + 1 
        : 1;
    }


    async getProducts(){
        try {
           const  productsRaw = await fs.promises.readFile(this.pathFile,"utf-8")
            const products=JSON.parse(productsRaw);
            return products;
        } catch (error) {
            throw new Error ("no se pudieron mostrar los productos adecuadamente por:",error.message)
        }
    }

    async addProduct(newProduct) {
    try {if(!newProduct.title || !newProduct.price ){
        throw new Error("Faltan datos obligatiorios como name o price")
    }else{
        if(typeof newProduct.price !== "number"){
           throw new Error("el precio debe ser un numero") 
        }else{
        const productsRaw = await fs.promises.readFile(this.pathFile, "utf-8");
        const products = JSON.parse(productsRaw);
        const product = { id: this.generateNewId(products), ...newProduct };
        products.push(product);
        await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");
        }
    }
    } catch (error) {
        throw new Error("No se pudo crear el producto adecuadamente: " + error.message);
    }
    }
    async getProductById(id) {
  try {
    const productsRaw = await fs.promises.readFile(this.pathFile, "utf-8");
    const products = JSON.parse(productsRaw);

    const product = products.find(p => p.id == id); 

    if (!product) {
      throw new Error(`No se encontró producto con id ${id}`);
    }

    return product;
  } catch (error) {
    throw new Error("Error al obtener el producto: " + error.message);
  }
}

    async deleteProductById(id) {
    try {
        const productsRaw = await fs.promises.readFile(this.pathFile, "utf-8");
        const products = JSON.parse(productsRaw);

        const idNum = Number(id);

        const index = products.findIndex(p => p.id === idNum);

        if (index === -1) {
            throw new Error(`No se encontró ningún producto con el ID ${id}`);
        }

        products.splice(index, 1); 

        await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");

    } catch (error) {
        throw new Error("No se pudo eliminar el producto: " + error.message);
    }
}


    async updateProductById(idProduct, updatedProduct) {
  try {
    const productsRaw = await fs.promises.readFile(this.pathFile, "utf-8");
    const products = JSON.parse(productsRaw);

    const numericId = Number(idProduct); 

    const index = products.findIndex(p => p.id === numericId);
    if (index === -1) {
      throw new Error(`No se encontró ningún producto con el ID ${numericId}`);
    }

    products[index] = {
      ...products[index],
      ...updatedProduct,
      id: numericId 
    };

    await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");

  } catch (error) {
    throw new Error("No se pudo actualizar el producto: " + error.message);
  }
}

}
export default ProductManager;