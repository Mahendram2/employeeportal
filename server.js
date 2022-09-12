// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const Announcement = require('./models/announcement')
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
app.get('/announcement/seed',(req,res) => {
    const data = require('./data.json');
    Announcement.deleteMany({}, (err, result) => {
        Announcement.insertMany(data, (err,result) => {
            res.redirect('/announcement')
        });
    });
});


// Home - Reload to Announcement page
app.get('/', (req,res) => res.redirect('/announcement'));


// Index
app.get('/announcement', (req,res) => {
    Announcement.find({}, (error, announcement) => {
        res.render('index.ejs', {
            announcement: announcement,
        })
    })
    
})


// New
app.get('/announcement/new', (req,res) =>{
    res.render('new.ejs')
})


// Delete
app.delete('/announcement/:id', (req,res) =>{
    Announcement.findByIdAndDelete(req.params.id, (err,deletedAnnouncement) =>{
        res.redirect('/announcement');
    })
})


// Update
app.put('/announcement/:id',(req,res)=>{
    Announcement.findByIdAndUpdate(req.params.id, req.body, (err, oldAnnouncementVersion) => {
        res.redirect('/announcement/' + req.params.id);
        res.render('edit.ejs', {
            Announcement: oldAnnouncementVersion
        });

    })
})


// Create
app.post('/announcement', (req,res) => {
    Announcement.create(req.body, (err, Announcement) => {
        console.log('Error :', err)
        res.redirect('/announcement');
    })
});


// Edit
app.get('/announcement/:id/edit', (req,res)=>{
    Announcement.findById(req.params.id, (err, announcement) =>{
        res.render('edit.ejs', {announcement: announcement})
    });
});


// Show
app.get('/announcement/:id', (req, res) => {
    Announcement.findById(req.params.id, (err, Announcement) => {
        res.render('show.ejs', { Announcement: Announcement })
    });
});


// Listener
app.listen(port, () =>{
    console.log('Express is running on Port: ', port)
})
