const fs = require('fs')

class ProductManager {
    constructor(path) {
        this.path = path;
        this.format = 'utf-8';
        this.products = [];
    }

    getNextId() {
        let size = this.products.length //longitud del array
        return size > 0 ? this.products[size - 1].id + 1 : 1 //Si la longitud del array es mayor a 0 leeme el id del ultimo elemento del array de lo contrario va a ser el primero
    }

    #newProduct(id, title, description, price, thumbnail, code, stock) {
        const newProduct = {
            id: id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        return newProduct
    }

    #errorCheck(newProduct, operation) { //Chequear campos
        const errors = [];
        if (operation == "add") {
            this.products.forEach(element => {
                if (element.code == newProduct.code)
                    errors.push([`Code "${newProduct.code} ya existe`])
            }
            )
            if (Object.values(newProduct).includes(undefined || "" || null || NaN)) errors.push('Hay campos sin rellenar')
        }
    }

    async #getIndex(id) {
        let index; //
        let product = await this.getProductById(id)
        if (product != `El id: ${id} no se ha encontrado`)
            index = this.products.indexOf(product);
        else return console.log(product)
        return index
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        await this.getProducts()
        const newProduct = this.#newProduct(this.getNextId(), title, description, price, thumbnail, code, stock)
        const errors = this.#errorCheck(newProduct, "add")
        errors.length == 0 ?
            (this.product.push(newProduct, "add"),
                await fs.promises.writeFile(this.path, JSON.stringify(this.products))) :
            errors.forEach(error => console.log(error));
    }

    getProducts = async () => {
        try {
            let content = await fs.promises.readFile(this.path, this.format)
            this.products = JSON.parse(content)
            return this.products
        } catch (error) {
            return console.log(`Error getProducts : ${error}`);
        }
    }


    getProductById = async (id) => {
        await this.getProducts()
        return this.products.find(product => product.id == id) || `El id: ${id} no se ha encontrado`;
    }

    updateProductById = async (id,title,description,price,thumbnail,code,stock) => {
        const index = await this.#getIndex(id)
        const updatedProduct= this.#newProduct(id,title,description,price,thumbnail,code,stock)
        const errors = this.#errorCheck(updatedProduct, "update")
        errors.length == 0 ? (this.products[index]=updatedProduct, await fs.promises.writeFile(this.path, JSON.stringify(this.products))) :
        errors.forEach(error => console.error(error));
    }

    deleteProductById = async (id) => {
        const index = await this.#getIndex(id)
        if(index) (this.products.splice(index, 1), await fs.promises.writeFile(this.path,JSON.stringify(this.products)))
    }
}

module.exports = ProductManager;