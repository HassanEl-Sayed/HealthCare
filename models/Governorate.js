const mongoose = require('mongoose')

const goverSchema = new mongoose.Schema({
    
    name:{
        type :String,
      //  required:true
    }        
})

goverSchema.virtual('area', {
    ref: 'Area',
    localField: '_id',
    foreignField: 'governorateId'
})

const Governorate = mongoose.model('Governorate', goverSchema)

module.exports = Governorate


