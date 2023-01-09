const mongoose = require('mongoose')

const specialtiesSchema = new mongoose.Schema({
    
    specialties: {
        type: String,
        required : true
    }
})

specialtiesSchema.virtual('doctors', {
    ref: 'Doctor',
    localField: '_id',
    foreignField: 'specialtiesId'
})

const Specialties = mongoose.model('Specialties', specialtiesSchema)

module.exports = Specialties