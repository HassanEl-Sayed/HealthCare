var express = require('express');
var router = express.Router();
const Payment = require('../models/Payment')
const PaymentMethod = require('../models/PaymentMethod')
const auth = require('../middleware/auth')

//Add Payment
router.post('/addPayment',auth, async (req, res) => {
    const payment = new Payment({
        VisaName: req.body.VisaName,
        VisaID: req.body.VisaID,
        userId: req.user._id,
        ExpireDate: req.body.ExpireDate 
        // PaymentMethodId: req.body.PaymentMethodId
    })
    try {
        await payment.save()
        res.status(201).send(payment)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Add Payment Method
router.post('/addPaymentMethod', async (req, res) => {
    const paymentMethod = new PaymentMethod(req.body)
    try {
        await paymentMethod.save()
        res.status(201).send(paymentMethod)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get all payments
router.get('/all', auth ,async (req, res) => {
    try {
       const userPayments= await Payment.find({userId: req.user._id })
    //    .populate('PaymentMethodId')
       res.send(userPayments)
    } catch (error) {
        res.status(404).send(error)
    }
})

//get last payment
router.get('/lastpayment', auth ,async (req, res) => {
    try {
       const userPayments= await Payment.findOne({userId: req.user._id })
    //    .populate('PaymentMethodId')
       .sort({_id:-1})
       res.send(userPayments)
    } catch (error) {
        res.status(404).send(error)
    }
})

// One Payment 
router.get('/:id', auth ,async (req, res) => {
    try {
        const payment = await Payment.findById({_id: req.params.id}).populate('PaymentMethodId') 
        res.status(200).send(payment)
    } catch (e) {
        res.status(500).send(e)
    }
})

//get all payment Methods
router.get('/Methods/all',async (req, res) => {
    try {
       const methods= await PaymentMethod.find({})
       res.send(methods)
    } catch (error) {
        res.status(404).send(error)
    }
})

//Update Paymnet
router.patch('/PaymentUpdate/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['VisaName','VisaID', 'PaymentMethodId']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const payment = await Payment.findByIdAndUpdate(_id,req.body, {new : true , runValidators : true})

        if(!payment){
                    return res.status(404).send()
        }
        res.send(payment)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Remove Payment
router.delete('/removePayment/:id', auth, async (req, res) => {
    const payment = await Payment.findByIdAndDelete({_id: req.params.id})
    try {
        res.status(201).send(payment)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Remove PaymentMethod
router.delete('/removePaymentMethod/:id', async (req, res) => {
    const paymentMethod = await PaymentMethod.findByIdAndDelete({_id: req.params.id})
    try {
        res.status(201).send(paymentMethod)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;