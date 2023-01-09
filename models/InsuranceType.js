const mongoose = require('mongoose')

const insuranceTypeSchema = new mongoose.Schema({
    name:{
        type :String,
        required:true
    }        
})

insuranceTypeSchema.virtual('insurance', {
    ref: 'Insurance',
    localField: '_id',
    foreignField: 'insuranceTypeId'
})

const InsuranceType = mongoose.model('InsuranceType', insuranceTypeSchema)

module.exports = InsuranceType

