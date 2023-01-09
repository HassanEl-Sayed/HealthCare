const mongoose = require('mongoose')

const genderSchema = new mongoose.Schema({
    
    gender: {
        type: String,
        required : true
    }
})


const Gender = mongoose.model('Gender', genderSchema)

module.exports = Gender