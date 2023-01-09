const mongoose = require('mongoose')

const HCInsValueSchema = new mongoose.Schema({
    
    Discount: {
        type: Number,
        // required:true
    },
    hospitalId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    clinicId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    },
    specialtiesId:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Specialties'
    },
    InsuranceId:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Insurance'
    }
})

const HCInsValue= mongoose.model('HCInsValue' , HCInsValueSchema)
 module.exports = HCInsValue