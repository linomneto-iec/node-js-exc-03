const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let users_api = express.Router()

const knex = require('knex')({ 
    client: 'pg', 
    debug: true, 
    connection: { 
        connectionString : process.env.DATABASE_URL, 
        ssl: { rejectUnauthorized: false }, 
      } 
});

users_api.post('/', (req, res) => {
    const payload = req.body

    if (!payload || !payload.name || !payload.login || !payload.pwd || !payload.email) {
        res.status(400).json({ message: "bad user payload" })
        return
    }

    knex('user')
        .insert({
            name: payload.name,
            login: payload.login,
            pwd: bcrypt.hashSync(payload.pwd, 8),
            email: payload.email
        }, ['id'])
        .then((result) => {
            res.status(201).json({ 
                message: "user created successfully",
                created_id: result[0].id 
            })
            return
        })
        .catch(err => {
            res.status(500).json({
                message: 'error to create user into database -> ' + err.message
            })
        })
})

users_api.post('/login', (req, res) => {
    const payload = req.body

    if (!payload || !payload.login || !payload.pwd) {
        res.status(400).json({ message: "bad login payload" })
        return
    }

    knex
        .select('*')
        .from('usuario')
        .where({ login: payload.login })
        .then(users => {
            if (users.length) {
                let user = users[0]
                if (bcrypt.compareSync(payload.pwd, user.pwd)) {
                    let jwt = jwt.sign({ id: usuario.id },
                        process.env.SECRET_KEY, {
                        expiresIn: 3600
                    })
                    res.status(200).json({
                        id: user.id,
                        login: user.login,
                        nome: user.name,
                        roles: user.roles,
                        token: jwt
                    })
                    return
                }
            } else {
                res.status(401).json({ message: 'login or password incorrect' })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'error to get user data from database -> ' + err.message
            })
        })
})

module.exports = users_api; 