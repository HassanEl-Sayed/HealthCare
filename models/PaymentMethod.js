const mongoose = require('mongoose')

const paymentMethodSchema = new mongoose.Schema({
   
    methodName: {
        type: String,
         required : true 
    },
})
paymentMethodSchema.virtual('payment', {
    ref: 'Payment',
    localField: '_id',
    foreignField: 'PaymentMethodId'
})


const PaymentMethod = mongoose.model('PaymentMethod' , paymentMethodSchema)

module.exports = PaymentMethod