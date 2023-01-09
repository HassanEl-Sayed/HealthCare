const mongoose = require('mongoose')

const hospitalSchema = mongoose.Schema({

    name : {
        type : String ,
        required : true ,
    },
    description:{
        type: String,
        required: true
    },
    specialtiesId:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Specialties'
    }],
})
hospitalSchema.virtual('branches', {
    ref: 'BranshesHC',
    localField: '_id',
    foreignField: 'hospitalId'
})

const Hospital = mongoose.model('Hospital', hospitalSchema)

module.exports = Hospital
