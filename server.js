// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const Products = require('./models/products')
require('dotenv').config();
const methodOverride = require('method-override');


// Initalize
const app = express();


// Configure
const port = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI;
const db = mongoose.connection;


// Connect to MongoDB
mongoose.connect(DATABASE_URI);
db.on('connected', () => {
    console.log('Connected to MongoDB');
})
db.on('error', (err) => {
    console.log('MongoDB Error:' + err.message);
})


// Mount Middleware
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'))


// Routes - INDUCES


// Seed Route
app.get('/products/seed',(req,res) => {
    const data = require('./data.json');
    Products.deleteMany({}, (err, result) => {
        Products.insertMany(data, (err,result) => {
            res.redirect('/products')
        });
    });
});


// Home - Reload to product page
app.get('/', (req,res) => res.redirect('/products'));


// Index
app.get('/products', (req,res) => {
    Products.find({}, (error, products) => {
        res.render('index.ejs', {
            products: products,
        })
    })
    
})


// New
app.get('/products/new', (req,res) =>{
    res.render('new.ejs')
})


// Delete
app.delete('/products/:id', (req,res) =>{
    Products.findByIdAndDelete(req.params.id, (err,deletedProduct) =>{
        res.redirect('/products');
    })
})


// Update
app.put('/products/:id',(req,res)=>{
    Products.findByIdAndUpdate(req.params.id, req.body, (err, oldProductVersion) => {
        res.redirect('/products/' + req.params.id);
    })
})


// Create
app.post('/products', (req,res) => {
    Products.create(req.body, (err, product) => {
        console.log('Error :', err)
        res.redirect('/products');
    })
});


// Edit
app.get('/products/:id/edit', (req,res)=>{
    Products.findById(req.params.id, (err, foundProduct) =>{
        res.render('edit.ejs', {products: foundProduct})
    });
});


// Show
app.get('/products/:id', (req, res) => {
    Products.findById(req.params.id, (err, foundProduct) => {
        res.render('show.ejs', { product: foundProduct })
    });
});


// Listener
app.listen(port, () =>{
    console.log('Express is running on Port: ', port)
})
