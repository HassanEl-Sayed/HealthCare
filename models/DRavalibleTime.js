const mongoose = require('mongoose')

const DRavalibleTimeSchema = new mongoose.Schema({
    day: {
       type: String,
        required:true
    },
    timeFrom: {
        type: String,
       required:true
    },
    timeTo: {
        type: String,
       required:true
    },
    vezeeta:{
        type:Number,
       require:true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BranshesHC'
    }
})
DRavalibleTimeSchema.virtual('booked', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'drAvailTimeId'
})

const DrAvailTime = mongoose.model('DrAvailTime', DRavalibleTimeSchema)

module.exports = DrAvailTime