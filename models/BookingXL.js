const mongoose = require('mongoose')

const bookingXLSchema = new mongoose.Schema({
    info: {
        type: Date,
        default: Date.now
        // required:true
    },
    wattingTime: {
        type: String,
        default: "from half an hour to an hour"
    },
    xlAvailTimeId:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'XLavalibleTime'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: 'User'
    },
    paymentId:{
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: 'Payment'
    }
})

const BookingXL = mongoose.model('BookingXL' , bookingXLSchema)
module.exports = BookingXL