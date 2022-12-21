const express = require('express');
const app = express();

const ProductManager = require('./productmanager')
const manager = new ProductManager('./productos.json')

app.get('/products', async (req,res) => {
    const products = await manager.getProducts()
    let limite = req.query.limite
    if(!limite) res.send({products})
    else {
        const prodLimit = [];
        if(limite > products.length) limite = products.length;
        for(let index = 0; index < limite; index++) {
            prodLimit.push(products[index])
        }
        res.send({prodLimit})
    }
})

app.get('/products/:pid', async (req,res) => {
    const id = req.params.pid
    const product = await manager.getProductById(id)
    res.send({product})
})

app.listen(8080, () => {
    console.log("Servidor en puerto 8080");
});