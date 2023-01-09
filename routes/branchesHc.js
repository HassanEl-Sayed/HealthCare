var express = require('express');
var router = express.Router();
const BranshesHC = require('../models/BranchesHC');
const Doctor = require('../models/Doctor');
const authBranchesHC = require('../middleware/authBranchesHC');
const multer = require('multer')
const sharp = require('sharp');
//Add BranshesHC
router.post('/add', async (req, res) => {
    const branchesHC = new BranshesHC(req.body)
    try {
        await branchesHC.save()
        res.status(201).send(branchesHC)
    } catch (e) {
        res.status(400).send(e.message)
    }
})
//Update Profile
// router.patch('/update', authBranchesHC, async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'areaId', 'clinicId', 'email','password']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }
//     try {
//         updates.forEach((update) => req.user[update] = req.body[update])
//         await req.branchesHC.save()
//         res.send(req.branchesHC)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })
//Login
router.post('/login',async (req, res) => {
    try {
        const branchesHC = await BranshesHC.findByCredentials(req.body.email, req.body.password)
        const token = await branchesHC.generateAuthToken()
        res.send({ branchesHC, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})
//LogOut
router.post('/logout', authBranchesHC, async (req, res) => {
    try {
        req.branchesHC.tokens = req.branchesHC.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.branchesHC.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


//get all BranchesHc
router.get('/', async (req, res) => {
    try {
       const branchesHC = await BranshesHC.find({})
         .populate({ path: 'hospitalId', select: 'name', populate: { path: 'specialtiesId', select: 'specialties' } })
         .populate({ path: 'areaId', select: 'name', populate: { path: 'governorateId', select: 'name' } })
         .populate({ path: 'clinicId', select: 'name', populate: { path: 'specialtiesId', select: 'specialties' } })
         .limit(10)
       const Branch = branchesHC.map(doc=>{
           return{
               id:doc._id,
               Branchename :doc.name,
               Name: doc.hospitalId || doc.clinicId,
               Area : doc.areaId,
            // ClinicName : doc.clinicId,
               BrancheProfile : '/branchesHC/'+doc._id,
               image:doc.image
           }
      })
       res.send(Branch)
    } catch (error) {
        res.status(404).send(error)
    }
})

//Get One Branche
router.get('/:id', async (req, res) => {
    try {
        const branchesHC = await BranshesHC.findById({_id: req.params.id}) 
        .populate({ path: 'hospitalId', select: 'name', populate: { path: 'specialtiesId', select: 'specialties' } })
        .populate({ path: 'areaId', select: 'name', populate: { path: 'governorateId', select: 'name' } })
        .populate({ path: 'clinicId', select: 'name', populate: { path: 'specialtiesId', select: 'specialties' } })
       res.status(200).send(branchesHC)
    } catch (e) {
        res.status(500).send(e)
    }
})

//filter By [area and hospital name].
router.get('/search/filter', async (req, res) => {
    try {
        let query = {};
        if (req.query.area) {
            query.areaId = req.query.area
        }
        if (req.query.HCName) {
            query.$or = [
                { "name": { $regex: req.query.HCName, $options: '$i' }},
            ];
        }
        const Hospital = await BranshesHC.find(query)
            .populate({ path: 'hospitalId', select: 'name'})
            .populate({ path: 'clinicId', select: 'name'})
            .populate({ path: 'areaId', select: 'name' })
            .limit(10)
        res.send(Hospital)
    } catch (error) {
        res.status(404).send(error)
    }
})

//Get All branchesHc's doctors 
router.get('/doctors/:id', async (req, res) => {
    try {
        const branshesHC = await BranshesHC.findById({_id: req.params.id}).populate({path:'doctors'}) 
        res.status(200).send(branshesHC.doctors)
    } catch (e) {
        res.status(500).send(e)
    }
})

//filter By [doctors in this area branches].
router.get('/searchfilter/doctors/:AreaId', async (req, res) => {
    try {
        const Hospital= await BranshesHC.find({areaId:req.params.AreaId}).select('id')
        const doctor = BranshesHC.findById({ _id: [Hospital]}).populate({path:'doctors'}) 
        //db.collection('users').find({email:uEmail, ocassionTypes: {$elemMatch: {occasiontype:uocType}}},{email:1, ocassionTypes: {$elemMatch: {occasiontype:uocType}}})
        res.status(200).send(doctor.doctors)
    } catch (error) {
        res.status(404).send(error)
    }
})
//For Uploade an images
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

//Upload image
router.post('/image',authBranchesHC , upload.single('image'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 400 }).png().toBuffer()
    req.branchesHC.image = buffer
    await req.branchesHC.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//Remove branch HC
router.delete('/remove/:id', async (req, res) => {
    const branchesHc = await BranshesHC.findByIdAndDelete({_id: req.params.id})
    try {
        res.status(201).send(branchesHc)
    } catch (e) {
        res.status(400).send(e)
    }
})



module.exports = router;
