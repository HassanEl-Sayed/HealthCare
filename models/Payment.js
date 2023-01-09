const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    VisaName: {
        type: String,
        //required : true 
    },
    VisaID: {
        type: Number,
        // visiablilty: false,
         //required : true 
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: 'User'
    },
    ExpireDate: {
        type: Date,
    },
    // PaymentMethodId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'PaymentMethod'
    //      //required : true 
    // }
})


const Payment = mongoose.model('Payment' , paymentSchema)

module.exports = Payment
