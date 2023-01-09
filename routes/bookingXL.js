var express = require('express');
var router = express.Router();
const BookingXL = require('../models/BookingXL')
const auth = require('../middleware/auth')
const {sendWelcomeEmail,sendConfirmBooking} = require('../emails/account')

//book an appointment
router.post('/', auth ,async (req, res) => {
    const Book = new BookingXL({
        info: req.body.info,
        wattingTime: req.body.wattingTime,
        xlAvailTimeId: req.body.xlAvailTimeId,
        userId: req.user._id,
        paymentId: req.body.paymentId
    })   

    try {
        await Book.save()
        sendWelcomeEmail( Book.user.email, Book.user.firstName, Book.drAvailTimeId.branchId.name  )
        res.status(201).send(Book)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//get all Booking history done by specific user
router.get('/all', auth ,async (req, res) => {
    try {
        const userbooking = await BookingXL.find({userId: req.user._id })
        .populate('xlAvailTimeId paymentId')
        .populate({path: 'xlAvailTimeId',populate: {path: 'branchId', select: 'name',populate: { path: 'areaId', select: 'name' }}})
        .populate({path: 'xlAvailTimeId',populate: {path: 'branchId', select: 'name',populate:{path: 'labId',selesct : 'name'}}})
        .populate({path: 'xlAvailTimeId',populate: {path: 'branchId', select: 'name',populate:{path: 'xrayId',selesct : 'name'}}})
        .populate({path: 'xlAvailTimeId',populate: {path: 'typeId', select: 'type'}})
        res.send(userbooking)
    } catch (error) {
        res.status(404).send(error)
    }
})
// //get all Booking history done for specific doctor
// router.get('/doctor/:id' ,async (req, res) => {
//     try {
//        const doctorbooking = await Doctor.find({_id: req.params._id })
//        .populate({ path: 'booked', select: 'info' ,populate:{path: 'userId',selesct : 'firstName LastName'}})
//        .populate({ path: 'booked',populate:{path: 'drAvailTimeId',selesct : 'day timeFrom timeTo vezeeta'}})
//        res.send(doctorbooking)
//     } catch (error) {
//         res.status(404).send(error)
//     }
// })

//get last Booking
router.get('/lastbooking', auth ,async (req, res) => {
    try {
        const userbooking= await BookingXL.findOne({userId: req.user._id })
        .populate('xlAvailTimeId paymentId')
        .populate({path: 'xlAvailTimeId', select: 'day timeFrom timeTo vezeeta'})
        .populate({path: 'xlAvailTimeId',populate: {path: 'branchId', select: 'name',populate: { path: 'areaId', select: 'name' }}})
        .populate({path: 'xlAvailTimeId',populate: {path: 'branchId', select: 'name',populate:{path: 'labId',selesct : 'name'}}})
        .populate({path: 'xlAvailTimeId',populate: {path: 'branchId', select: 'name',populate:{path: 'xrayId',selesct : 'name'}}})
        .populate({path: 'xlAvailTimeId',populate: {path: 'typeId', select: 'type'}})
        .sort({_id:-1})
        res.send(userbooking)
    } catch (error) {
        res.status(404).send(error)
    }
})
//Get One Booking
router.get('/:id', auth , async (req, res) => {
    try {
        const booking = await BookingXL.findById({_id: req.params.id}).populate('xlAvailTimeId paymentId')
        .populate({path: 'xlAvailTimeId', select: 'day timeFrom timeTo vezeeta'})
        .populate({path: 'xlAvailTimeId',populate: {path: 'branchId', select: 'name',populate: { path: 'areaId', select: 'name' }}})
        .populate({path: 'xlAvailTimeId',populate: {path: 'branchId', select: 'name',populate:{path: 'labId',selesct : 'name'}}})
        .populate({path: 'xlAvailTimeId',populate: {path: 'branchId', select: 'name',populate:{path: 'xrayId',selesct : 'name'}}})
        .populate({path: 'xlAvailTimeId',populate: {path: 'typeId', select: 'type'}})
        res.status(200).send(booking)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Update booked appointment
router.patch('/bookingUpdate/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['xlAvailTimeId', 'paymentId']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const booked = await BookingXL.findByIdAndUpdate(_id,req.body, {new : true , runValidators : true})

        if(!booked){
                    return res.status(404).send()
        }
        res.send(booked)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Remove booking 
router.delete('/remove/:id', auth, async (req, res) => {
    const booking = await BookingXL.findByIdAndDelete({_id: req.params.id})
    try {
        res.status(201).send(booking)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;