var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth')
const User = require('../models/User')
const Rating = require('../models/Rating')
const Diagnosis = require('../models/Diagnosis')
const AnalysisResult = require('../models/AnalysisResult')
const multer = require('multer')
const sharp = require('sharp');
const {sendWelcomeEmail,sendConfirmBooking} = require('../emails/account')
const Gender = require('../models/gender')

//get gender
router.get('/gender', async (req, res) => {
    try {
        const gender = await Gender.find({})
        res.send(gender)
    } catch (error) {
        res.status(404).send(error.message)
    }
})
//add gender
router.post('/gender', async (req, res) => {
    const gender = new Gender(req.body)
    try {
        await gender.save()
        res.status(201).send(gender)
    } catch (e) {
        res.status(400).send(e)
    }
})

//SignUp
router.post('/signUp', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        //sendWelcomeEmail(user.email , user.firstName)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})
//LogOut
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


//Profile
router.get('/userprofile', auth, async (req, res) => {
await req.user.populate({path:'AreaId', select: 'name' ,populate:{path:'governorateId',select: 'name' }})
await req.user.populate({path:'InsuranceId' ,select: 'name' ,populate:{path:'insuranceTypeId', select: 'name' }})
await req.user.populate({ path:'diagnosis', select: '  Diagnosis medicines AnalysisNeeded', populate: { path: 'doctorId', select: 'firstName LastName' } })
await req.user.populate('genderId')
res.send(req.user)


})

//Update Profile
router.patch('/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'LastName', 'birthDate', 'phoneNumber','diseases','insuranceNo','insuranceExpireDate','email','password','avatar']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete
router.delete('/Account', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

//For Uploade an images[Avatar/InsuranceCard]
const upload = multer({
    limits:{
        fileSize:2000000
    },
    fileFilter(req, file , cb){
        if (!file.originalname.match(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/)){
            return cb (new Error('please upload an image'))
        }
        cb(undefined , true)
    }
})

//Upload Avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:300,height:400}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
} , (error , req , res ,next) =>{
    res.status(400).send({error : error.message})
})

//delete Avatar
router.delete('/avatar' , auth , async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//Upload InsuranceCard
router.post('/insuranceCard', auth, upload.single('insuranceCard'), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).png().toBuffer()
    req.user.insuranceCard = buffer
    await req.user.save()
    res.send()
} , (error , req , res ,next) =>{
    res.status(400).send({error : error.message})
})

//delete InsuranceCard
router.delete('/insuranceCard' , auth , async(req,res)=>{
    req.user.insuranceCard = undefined
    await req.user.save()
    res.send()
})

//user rate
router.post('/rating', auth ,async (req, res) => {
    const rate = new Rating({
        Review: req.body.Review,
        ratingValue:req.body.ratingValue,
        doctorId:req.body.doctorId,
        userId: req.user._id //store id of user auto that user when login
    })
    try {
        await rate.save()
        res.status(201).send(rate)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//to get Diagnosis for one user
router.get('/diagnosis/:id', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
            .populate({ path: 'diagnosis', select: 'Diagnosis medicines  AnalysisNeeded', populate: { path: 'doctorId', select: 'firstName LastName' } })
        res.status(200).send(user.diagnosis)
    } catch (e) {
        res.status(500).send(e.message)
    }
})
//to get Diagnosis for logged in user
router.get('/diagnosis',auth, async (req, res) => {
    try {
        const diagnosis = await Diagnosis.find({userId: req.user._id })
            .populate({ path: 'doctorId', select: 'firstName LastName' })
        res.status(200).send(diagnosis)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//to get AnalysisResult for one user
router.get('/AnalysisResult/:id', async (req, res) => {
    try {
        const analysisResult = await AnalysisResult.find({ userId: req.params.id })
            .populate({ path: 'branchId', select: 'name' } )
        res.status(200).send(analysisResult)
    } catch (e) {
        res.status(500).send(e.message)
    }
})
//to get AnalysisResult for logged in user
router.get('/AnalysisResults',auth, async (req, res) => {
    try {
        const analysisResult = await AnalysisResult.find({userId: req.user._id })
            .populate({ path: 'branchId', select: 'name' })
        res.status(200).send(analysisResult)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//get All user
router.get('/', async (req, res) => {
    try {
        const users = await User.find({})
        .populate({path:'AreaId', select: 'name' ,populate:{path:'governorateId',select: 'name' }})
        .populate({path:'InsuranceId' ,select: 'name' ,populate:{path:'insuranceTypeId', select: 'name' }})
        res.send(users)
    } catch (error) {
        res.status(404).send(error.message)
    }
})
//get One Users
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
        .populate({path:'AreaId', select: 'name' ,populate:{path:'governorateId',select: 'name' }})
        .populate({path:'InsuranceId' ,select: 'name' ,populate:{path:'insuranceTypeId', select: 'name' }})
        res.send(user)
    } catch (error) {
        res.status(404).send(error.message)
    }
})
//To show image in web
router.get('/:id/avatar', async (req ,res) =>{
    try {
        const user = await User.findById(req.params.id)
        
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('content-Type' , 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router;
