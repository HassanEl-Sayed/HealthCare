var express = require('express');
var router = express.Router();
const authDoc = require('../middleware/authDoc');
const Doctor = require('../models/Doctor')
const User =require('../models/User')
const Diagnosis = require('../models/Diagnosis')
const multer = require('multer')
const sharp = require('sharp');
const Title = require('../models/title');

//add title
router.post('/addTitle', async (req, res) => {
    const title = new Title(req.body)
    try {
        await title.save()
        res.status(201).send(title)
    } catch (e) {
        res.status(400).send(e)
    }
})
//get title
router.get('/title', async (req, res) => {
    try {
        const title = await Title.find({})
        res.send(title)
    } catch (error) {
        res.status(404).send(error)
    }
})

//SignUp
router.post('/signUp', async (req, res) => {
    const doctor = new Doctor(req.body)
    try {
        await doctor.save()
        const token = await doctor.generateAuthToken()
        res.status(201).send({ doctor, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//Login
router.post('/login', async (req, res) => {
    try {
        const doctor = await Doctor.findByCredentials(req.body.email, req.body.password)
        const token = await doctor.generateAuthToken()
        res.send({ doctor, token })
    } catch (e) {
        res.status(400).send()
    }
})
//LogOut
router.post('/logout', authDoc, async (req, res) => {
    try {
        req.doctor.tokens = req.doctor.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.doctor.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
//Profile
router.get('/doctorprofile', authDoc, async (req, res) => {
    await req.doctor.populate('specialtiesId')
    await req.doctor.populate({ path: 'rate', select: 'Review ratingValue', populate: { path: 'userId', select: 'firstName LastName' } })
    await req.doctor.populate({path: 'BranchId', select: 'name' ,populate:{path: 'hospitalId',selesct : 'name'}})
    await req.doctor.populate({path: 'BranchId', select: 'name' ,populate:{path: 'clinicId',selesct : 'name'}})
    await req.doctor.populate({path: 'BranchId', select: 'name' ,populate:{path: 'areaId',selesct : 'name'}})
    await req.doctor.populate('titleId')
    await req.doctor.populate('genderId')
    res.send(req.doctor)
})
//Update Profile
router.patch('/profile', authDoc, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'LastName', 'birthDate', 'phoneNumber', 'email', 'password', 'title']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.doctor[update] = req.body[update])
        await req.doctor.save()
        res.send(req.doctor)
    } catch (e) {
        res.status(400).send(e)
    }
})
//Delete
router.delete('/Account', authDoc, async (req, res) => {
    try {
        await req.doctor.remove()
        res.send(req.doctor)
    } catch (e) {
        res.status(500).send()
    }
})
//Get all Doctors
router.get('/', async (req, res) => {
    try {
        const doctor = await Doctor.find({})
            .populate('titleId')
            .populate({ path: 'rate', select: 'Review ratingValue', populate: { path: 'userId', select: 'firstName LastName' } })
            .populate({ path: 'BranchId', select: 'name' ,populate:{path: 'hospitalId',selesct : 'name'}})
            .populate({ path: 'BranchId', select: 'name' ,populate:{path: 'clinicId',selesct : 'name'}})
            .populate({ path: 'BranchId', select: 'name' ,populate:{path: 'areaId',selesct : 'name'}})
            .populate({ path: 'specialtiesId', select: 'specialties' }).populate('genderId').populate('titleId')
            .limit(10)
        const doctors = doctor.map(doc => {
            return {
                id: doc._id,
                firstName: doc.firstName,
                LastName: doc.LastName,
                email: doc.email,
                titleId:doc.titleId,
                birthDate: doc.birthDate,
                phoneNumber: doc.phoneNumber,
                specialties: doc.specialtiesId,
                Hospitals: doc.BranchId,
                Rate: doc.avgRating,
                Feedback: doc.rate,
                avatar:doc.avatar
            }
        })
        res.send(doctors)
    } catch (error) {
        res.status(404).send(error)
    }
})
//Get all Doctors
router.get('/doctors/all', async (req, res) => {
    try {
        const doctor = await Doctor.find({})
            .populate('titleId')
            .populate({ path: 'rate', select: 'Review ratingValue', populate: { path: 'userId', select: 'firstName LastName' } })
            .populate({ path: 'BranchId', select: 'name' ,populate:{path: 'hospitalId',selesct : 'name'}})
            .populate({ path: 'BranchId', select: 'name' ,populate:{path: 'clinicId',selesct : 'name'}})
            .populate({ path: 'BranchId', select: 'name' ,populate:{path: 'areaId',selesct : 'name'}})
            .populate({ path: 'specialtiesId', select: 'specialties' }).populate('genderId').populate('titleId')
        const doctors = doctor.map(doc => {
            return {
                id: doc._id,
                firstName: doc.firstName,
                LastName: doc.LastName,
                email: doc.email,
                titleId:doc.titleId,
                birthDate: doc.birthDate,
                phoneNumber: doc.phoneNumber,
                specialties: doc.specialtiesId,
                Hospitals: doc.BranchId,
                Rate: doc.avgRating,
                Feedback: doc.rate,
                avatar:doc.avatar
            }
        })
        res.send(doctors)
    } catch (error) {
        res.status(404).send(error)
    }
})
//Get One Doctor
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById({ _id: req.params.id })
            .populate('titleId')
            .populate({ path: 'rate', select: 'Review ratingValue', populate: { path: 'userId', select: 'email' } })
            .populate({ path: 'BranchId', select: 'name' ,populate:{path: 'hospitalId',selesct : 'name'}})
            .populate({ path: 'BranchId', select: 'name' ,populate:{path: 'clinicId',selesct : 'name'}})
            .populate({ path: 'BranchId', select: 'name' ,populate:{path: 'areaId',selesct : 'name'}})
            .populate({ path: 'specialtiesId', select: 'specialties' }).populate('genderId').populate('titleId')
        res.send(doctor)
    } catch (error) {
        res.status(404).send(error)
    }
})

// AvalibleTime for one Doctor 
router.get('/AvalibleTime/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById({ _id: req.params.id })
            .populate({path: 'availTime', select: 'day timeFrom timeTo vezeeta',
            populate: {path: 'branchId', select: 'name',populate: { path: 'areaId', select: 'name' }}})
            .populate({path: 'availTime',
            populate: {path: 'branchId', select: 'name',populate:{path: 'hospitalId',selesct : 'name'}}})
            .populate({path: 'availTime',
            populate: {path: 'branchId', select: 'name',populate:{path: 'clinicId',selesct : 'name'}}})
            .populate({path: 'availTime', select: 'day timeFrom timeTo vezeeta',populate: {path: 'doctorId', select: 'firstName LastName'}})
        res.status(200).send(doctor.availTime)
    } catch (e) {
        res.status(500).send(e)
    }
})
// AvalibleTime for one Doctor in one branch 
router.get('/AvalibleTime', async (req, res) => {
    try {
        let query = {};
        if (req.query.branchId) {
            query.branchId = req.query.branchId
        }
        if (req.query.doctorId) {
            query.doctorId = req.query.doctorId
        }
        const doctor = await Doctor.find(query)
            .populate({path: 'availTime', select: 'day timeFrom timeTo vezeeta',
            populate: {path: 'branchId', select: 'name',populate: { path: 'areaId', select: 'name' }}})
            .populate({path: 'availTime',
            populate: {path: 'branchId', select: 'name',populate:{path: 'hospitalId',selesct : 'name'}}})
            .populate({path: 'availTime',
            populate: {path: 'branchId', select: 'name',populate:{path: 'clinicId',selesct : 'name'}}})
            .populate({path: 'availTime', select: 'day timeFrom timeTo vezeeta',populate: {path: 'doctorId', select: 'firstName LastName'}})
        res.status(200).send(doctor.availTime)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//to get rating for doctor
router.get('/rate/:id', async (req, res) => {
    try {
        const dr = await Doctor.findById({ _id: req.params.id })
            .populate({ path: 'rate', select: 'Review ratingValue', populate: { path: 'userId', select: 'firstName LastName' } })
        res.status(200).send(dr.rate)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//filter By [specialties-drTitle-drname].
router.get('/search/filter', async (req, res) => {
    try {
        let query = {};
        if (req.query.specialties) {
            query.specialtiesId = req.query.specialties
        }
        if (req.query.drTitle) {
            query.titleId = req.query.drTitle
        }
        if (req.query.drName) {
            query.$or = [
                { "firstName": { $regex: req.query.drName, $options: '$i' }},
                { "LastName":  { $regex: req.query.drName, $options: '$i' }},
            ];
        }
        const doctors = await Doctor.find(query)
            .populate('titleId')
            .populate({ path: 'BranchId', select: 'name'})
            .populate({ path: 'specialtiesId', select: 'specialties' })
            .sort({avgRating:-1 }).limit(10)
        res.send(doctors)
    } catch (error) {
        res.status(404).send(error)
    }
})

//Search Users
router.get('/search/users',authDoc ,async (req, res) => {
    try {
        let query = {};
        if (req.query.userEmail) {
            query.$or = [
                { "email": { $regex: req.query.userEmail, $options: '$i' }},
            ];
        }
        const users = await User.find(query)
        res.send(users)
    } catch (error) {
        res.status(404).send(error.message)
    }
})
//doctors do diagnosis 
router.post('/diagnosis', authDoc ,async (req, res) => {
    const diagnosis = new Diagnosis({
        Diagnosis:req.body.Diagnosis,
        medicines: req.body.medicines,
        AnalysisNeeded: req.body.AnalysisNeeded,
        userId:req.body.userId,
        doctorId: req.doctor._id //store id of doctor auto that doctor when login
    })
    try {
        await diagnosis.save()
        res.status(201).send(diagnosis)
    } catch (e) {
        res.status(400).send(e.message)
    }
})
//For Uploade an images[Avatar/InsuranceCard]
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/)) {
            return cb(new Error('please upload an image'))
        }
        cb(undefined, true)
    }
})

//Upload Avatar
router.post('/avatar', authDoc, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 400 }).png().toBuffer()
    req.doctor.avatar = buffer
    await req.doctor.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


//delete Avatar
router.delete('/avatar', authDoc, async (req, res) => {
    req.doctor.avatar = undefined
    await req.doctor.save()
    res.send()
})
module.exports = router;

