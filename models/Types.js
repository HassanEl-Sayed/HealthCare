const mongoose = require('mongoose')

const TypesSchema = new mongoose.Schema({
    
    type: {
        type: String,
    }
})


TypesSchema.virtual('labs', {
    ref: 'Lab',
    localField: '_id',
    foreignField: 'typeId'
})

TypesSchema.virtual('xrays', {
    ref: 'XRay',
    localField: '_id',
    foreignField: 'typeId'
})
TypesSchema.virtual('availTimes', {
    ref: 'XLavalibleTime',
    localField: '_id',
    foreignField: 'typeId'
})
const Types = mongoose.model('Types' , TypesSchema)
module.exports = Types