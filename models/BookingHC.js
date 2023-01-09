const mongoose = require('mongoose')

const bookingHCSchema = new mongoose.Schema({
    info: {
        type: Date,
        default: Date.now,
        required:true
    },
    wattingTime: {
        type: String,
        default: "from half an hour to an hour"
    },
    drAvailTimeId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'DrAvailTime'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    paymentId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Payment'
    }
})

const BookingHC = mongoose.model('BookingHC' , bookingHCSchema)
module.exports = BookingHC