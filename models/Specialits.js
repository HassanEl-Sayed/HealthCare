const mongoose = require('mongoose')

const specialtiesSchema = new mongoose.Schema({
    
    specialties: {
        type: String,
      //  required : true
    }
})

specialtiesSchema.virtual('doctors', {
    ref: 'Doctor',
    localField: '_id',
    foreignField: 'specialtiesId'
})


//to delete objects
// specialtiesSchema.methods.toJSON = function () {
//     const specialties = this
//     const specialtiesObject = specialties.toObject()
//     delete specialtiesObject._id
//     return specialtiesObject
// }
const Specialties = mongoose.model('Specialties', specialtiesSchema)

module.exports = Specialties