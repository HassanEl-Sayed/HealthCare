const mongoose = require('mongoose')

const insuranceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    insuranceTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'InsuranceType'
    }

})

const Insurance = mongoose.model('Insurance', insuranceSchema)

module.exports = Insurance