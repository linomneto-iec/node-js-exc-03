const express = require('express')

let products_api = express.Router()

const knex = require('knex')({ 
    client: 'pg', 
    debug: true, 
    connection: { 
        connectionString : process.env.DATABASE_URL, 
        ssl: { rejectUnauthorized: false }, 
      } 
});

products_api.get('/', (req, res) => {
    knex.select('*').from('product') 
        .then( products => res.status(200).json(products) ) 
        .catch(err => { 
            res.status(500).json({  
                message: 'error to get products list from database -> ' + err.message 
            }) 
        })
})

products_api.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    knex.select('*').from('product').where({ id: id })
        .then(products => {
            if (products.length > 0) {
                res.status(200).json(products[0])
            } else {
                res.status(404).json({ message: "product " + id + " not found" })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'error to get product ' + id + ' from database -> ' + err.message 
            })
        })
})

products_api.post('/', (req, res) => {
    const payload = req.body

    if (!payload || !payload.description || !payload.value || !payload.brand) {
        res.status(400).json({ message: "bad product payload" })
        return
    }

    knex('product')
        .insert({
            description: payload.description,
            value: payload.value,
            brand: payload.brand,
        }, ['id'])
        .then((result) => {
            res.status(201).json({ 
                message: "product created successfully",
                created_id: result[0].id 
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'error to create product ' + id + ' into database -> ' + err.message 
            })
        })
})

products_api.put('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const payload = req.body

    if (!payload || !payload.description || !payload.value || !payload.brand) {
        res.status(400).json({ message: "bad product payload" })
        return
    }

    knex('product')
        .update({
            description: payload.description,
            value: payload.value,
            brand: payload.brand,
        })
        .where({ 
            id: id 
        })
        .then((n) => {
            if (n) {
                res.status(200).json({ 
                    message: "product updated successfully",
                    updated_id: id
                })
            } else {
                res.status(204).json({ message: "product id " + id + " not found" })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'error to update product ' + id + ' into database -> ' + err.message 
            })
        })
})

products_api.delete('/:id', (req, res) => {
    const id = req.params.id
    knex('product')
        .where({ 
            id: id 
        })
        .del()
        .then(() => {
            res.status(200).json({ 
                message: "product deleted successfully",
                deleted_id: id 
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'error to delete product ' + id + ' in database -> ' + err.message 
            })
        })
})

module.exports = products_api; 