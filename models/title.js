const mongoose = require('mongoose')

const titleSchema = new mongoose.Schema({
    
    title: {
        type: String,
        //required : true
    }
})

titleSchema.virtual('doctors', {
    ref: 'Doctor',
    localField: '_id',
    foreignField: 'titleId'
})

const Title = mongoose.model('Title', titleSchema)

module.exports = Title