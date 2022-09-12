const mongoose = require('mongoose');
const Schema = mongoose.Schema

const announceSchema = new Schema({
    name: {type:String, require:true},
    description: String
})

module.exports=mongoose.model('Accounce', announceSchema);
