const mongoose = require('mongoose')

const clinicSchema = mongoose.Schema({
    name : {
        type : String ,
        required : true ,
    },
    description:{
        type : String,
        required : true
    },
    specialtiesId:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Specialties'
    }]
})
clinicSchema.virtual('branches', {
    ref: 'BranshesHC',
    localField: '_id',
    foreignField: 'clinicId'
})

const Clinic = mongoose.model('Clinic', clinicSchema)

module.exports = Clinic
