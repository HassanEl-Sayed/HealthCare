var express = require('express');
var router = express.Router();
const multer = require('multer');
const sharp = require('sharp')
const BranchesXL = require('../models/XLBranches');
const AnalysisResult = require('../models/AnalysisResult');
const authBranchesXL = require('../middleware/authBranchesXL');
const User = require('../models/User')

//Add BranshesXL
router.post('/add', async (req, res) => {
    const branchesXL= new BranchesXL(req.body)
    try {
        await branchesXL.save()
        const token = await branchesXL.generateAuthToken()
        res.status(201).send({ branchesXL ,token})
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Login
router.post('/login',async (req, res) => {
    try {
        const branchesXL = await BranchesXL.findByCredentials(req.body.email, req.body.password)
        const token = await branchesXL.generateAuthToken()
        res.send({ branchesXL, token })
    } catch (e) {
        res.status(400).send()
    }
})
//LogOut
router.post('/logout', authBranchesXL, async (req, res) => {
    try {
        req.branchesXL.tokens = req.branchesXL.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.branchesXL.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
//Profile
router.get('/branchProfile', authBranchesXL, async (req, res) => {
    await req.branchesXL.populate({ path: 'areaId', select: 'name', populate: { path: 'governorateId', select: 'name' } })
    await req.branchesXL.populate({path: 'labId',populate:{path: 'typeId',selesct : 'type'}})
    await req.branchesXL.populate({path: 'xrayId',populate:{path: 'typeId',selesct : 'type'}})
    await req.branchesXL.populate('types')
    res.send(req.branchesXL)
})

//get all BranshesXL
router.get('/', async (req, res) => {
    try {
       const branchesXL = await BranchesXL.find({})
         .populate('types')
         .populate({ path: 'labId', select: 'name', populate: { path: 'typeId', select: 'type' } })
         .populate({ path: 'areaId', select: 'name', populate: { path: 'governorateId', select: 'name' } })
         .populate({ path: 'xrayId', select: 'name', populate: { path: 'typeId', select: 'type' } })
       const Branch = branchesXL.map(doc=>{
           return{
               id:doc._id,
               Branchename :doc.name,
               Name: doc.labId || doc.xrayId,
               Area : doc.areaId,
            // XrayName :doc.xrayId ,
               types:doc.types,
               email:doc.email,
               BrancheProfile : '/branchesXL/'+doc._id,
               image:doc.image
           }
      })
       res.send(Branch)
    } catch (error) {
        res.status(404).send(error)
    }
})

//Get One Branch
router.get('/:id', async (req, res) => {
    try {
        const branchesXL = await BranchesXL.findById({_id: req.params.id}) 
        .populate('types')
        .populate({ path: 'labId', select: 'name', populate: { path: 'typeId', select: 'type' } })
        .populate({ path: 'areaId', select: 'name', populate: { path: 'governorateId', select: 'name' } })
        .populate({ path: 'xrayId', select: 'name', populate: { path: 'typeId', select: 'type' } })
        res.status(200).send(branchesXL)
    } catch (e) {
        res.status(500).send(e)
    }
})
// //Get All branchesHc's types 
// router.get('/types/:id', async (req, res) => {
//     try {
//         const branchesXL = await BranchesXL.findById({_id: req.params.id}).populate({path:'type'}) 
//         res.status(200).send(branchesXL.type)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })
//filter By [area and hospital name].
router.get('/search/filter', async (req, res) => {
    try {
        let query = {};
        if (req.query.area) {
            query.areaId = req.query.area
        }
        if (req.query.XLName) {
            query.$or = [
                { "name": { $regex: req.query.XLName, $options: '$i' }},
            ];
        }
        const lab = await BranchesXL.find(query)
            .populate('types')
            .populate({ path: 'labId', select: 'name', populate: { path: 'typeId', select: 'type' } })
            .populate({ path: 'areaId', select: 'name', populate: { path: 'governorateId', select: 'name' } })
            .populate({ path: 'xrayId', select: 'name', populate: { path: 'typeId', select: 'type' } })
        res.send(lab)
    } catch (error) {
        res.status(404).send(error)
    }
})

// //filter By [doctors in this area branches].
// router.get('/searchfilter/doctors/:AreaId', async (req, res) => {
//     try {
//         const Hospital= await BranshesHC.find({areaId:req.params.AreaId}).select('id')
//         const doctor = BranshesHC.findById({ _id: [Hospital]}).populate({path:'doctors'}) 
//         //db.collection('users').find({email:uEmail, ocassionTypes: {$elemMatch: {occasiontype:uocType}}},{email:1, ocassionTypes: {$elemMatch: {occasiontype:uocType}}})
//         res.status(200).send(doctor.doctors)
//     } catch (error) {
//         res.status(404).send(error)
//     }
// })


//Labs and Xray send Analysis Results
router.post('/analysisResult/add',async (req, res) => {
    const analysisResult = new AnalysisResult({
        Results:req.body.file,
        userId:req.body.userId,
        branchId: req.body.branchId 
    })
    try {
        await analysisResult.save()
        res.status(201).send(analysisResult)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

// //get all Analysis Results send by specific Lab or Xray 
// router.post('/analysisResult/:id',async (req, res) => {
//     try {
//         const analysisResult = await AnalysisResult.find({branchId: req.params.id}) 
//                             .populate({ path: 'userId', select: 'firstName LastName email' })
//         res.status(200).send(analysisResult)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })
//Search Users
router.get('/search/users', authBranchesXL ,async (req, res) => {
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

//For Uploade Pdf
const uploadpdf = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png)$/)) {
            return cb(new Error('please upload an pdf'))
        }
        cb(undefined, true)
    }
})

//send the result
router.post('/sendresult', authBranchesXL, async (req, res) => {

    const analysisResult = new AnalysisResult({
        result:req.body.result,
        userId:req.body.userId,
        branchId: req.branchesXL._id
    })
    try {
        await analysisResult.save()
        res.status(201).send(analysisResult)
    } catch (e) {
        res.status(400).send(e.message)
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
router.post('/image',authBranchesXL , upload.single('image'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 400 }).png().toBuffer()
    req.branchesXL.image = buffer
    await req.branchesXL.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
//Remove branch XL
router.delete('/remove/:id', async (req, res) => {
    const branchesXL = await BranchesXL.findByIdAndDelete({_id: req.params.id})
    try {
        res.status(201).send(branchesXL)
    } catch (e) {
        res.status(400).send(e)
    }
})



module.exports = router;
