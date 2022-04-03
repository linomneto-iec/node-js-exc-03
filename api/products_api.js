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

let check_auth = (req, res, next) => {
    let auth_token = req.headers["authorization"]
    if (!auth_token) {
        res.status(401).json({ message: 'required access token' })
    } else {
        let token = auth_token.split(' ')[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken) => {
            if (err) {
                res.status(401).json({ message: 'access denied'})
                return
            }
            req.user_id = decodeToken.id
            next()
        })
    }
}

let is_admin = (req, res, next) => {
    knex
        .select('*').from('user').where({ id: req.user_id })
        .then((users) => {
            if (users.length) {
                let roles = users[0].roles.split(';')
                let admin_role = roles.find(i => i === 'ADMIN')
                if (admin_role === 'ADMIN') {
                    next()
                    return
                } else {
                    res.status(403).json({ message: 'admin role required' })
                    return
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'error to check user role -> ' + err.message 
            })
        })
}

products_api.get('/', check_auth, (req, res) => {
    knex.select('*').from('product') 
        .then( products => res.status(200).json(products) ) 
        .catch(err => { 
            res.status(500).json({  
                message: 'error to get products list from database -> ' + err.message 
            }) 
        })
})

products_api.get('/:id', check_auth, (req, res) => {
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

products_api.post('/', check_auth, is_admin, (req, res) => {
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

products_api.put('/:id', check_auth, is_admin, (req, res) => {
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

products_api.delete('/:id', check_auth, is_admin, (req, res) => {
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