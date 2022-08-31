const mongoose = require('mongoose');
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {type:String, require:true},
    description: String,
    img: String,
    price: Number,
    qty: Number
})

module.exports=mongoose.model('Products', productSchema);