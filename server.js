const express = require ('express') 
const cors = require('cors'); 
const path  = require ('path') 
const app = express () 
 

app.use(cors()) 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
 
app.use('/app', express.static (path.join (__dirname, '/public'))) 

const products_router = require('./api/products_api') 
app.use ('/api/products', products_router) 

let port = process.env.PORT || 3000 
app.listen (port) 