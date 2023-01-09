var express = require('express');
var router = express.Router();
const DrAvailTime = require('../models/DRavalibleTime');
const authDoc = require('../middleware/authDoc');
const { isNull } = require('util');

//Add DrAvailTime
router.post('/add', async (req, res) => {

    const drAvailTime = new DrAvailTime(req.body)
    try {
        await drAvailTime.save()
        res.status(201).send(drAvailTime)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get all DrAvailTime
router.get('/', async (req, res) => {
    try {
       const drAvailTime = await DrAvailTime.find({})
             .populate({ path: 'doctorId', select: 'firstName LastName email',populate: { path: 'specialtiesId', select: 'specialties' }})
             .populate({ path: 'branchId', select: 'name'  ,populate: { path: 'areaId', select: 'name' }})
       const tables = drAvailTime.map(doc=>{
           return{
            id:doc._id,
            day:doc.day,
            timeFrom:doc.timeFrom,
            timeTo:doc.timeTo,
            vezeeta: doc.vezeeta,
            doctor:doc.doctorId,
            Branche:doc.branchId,

           }
       })
       res.send(tables)
    } catch (error) {
        res.status(404).send(error)
    }
})

//get all booking for 1 dr
router.get('/booked/doctor',authDoc ,async (req, res) => {
    try {
       const drAvailTime = await DrAvailTime.find({doctorId:req.doctor._id,booked:req.params.booked})
             .populate({ path: 'booked',populate: { path: 'userId', select: 'firstName LastName email' }})
             .populate({ path: 'doctorId', select: 'doctorId'  ,populate: { path: 'specialtiesId', select: 'specialties' }})
             .populate({ path: 'branchId', select: 'name'  ,populate: { path: 'areaId', select: 'name' }})
             .populate({path: 'branchId', select: 'name',populate:{path: 'clinicId',selesct : 'name'}})
             .populate({path: 'branchId', select: 'name',populate:{path: 'hospitalId',selesct : 'name'}})
             const tables = drAvailTime.map(doc=>{
                return{
                 id:doc._id,
                 day:doc.day,
                 timeFrom:doc.timeFrom,
                 timeTo:doc.timeTo,
                 vezeeta: doc.vezeeta,
                 doctor:doc.doctorId,
                 Branch:doc.branchId,
                 Booked :doc.booked,
                }
            })
            res.send(tables)
    } catch (error) {
        res.status(404).send(error)
    }
})

//filter By [specialties-drTitle-drname].
router.get('/search/filter', async (req, res) => {
    try {
        let query = {};
        if (req.query.day) {
            query.day = req.query.day
        }
        if (req.query.moneyFrom && req.query.moneyTo ) {
            query.$and = [
                { "vezeeta": { $gte: req.query.moneyFrom, $lte: req.query.moneyTo} }
            ];
        }
        const drAvailTime = await DrAvailTime.find(query)
        .populate({ path: 'doctorId', select: 'firstName LastName'})
        .sort({vezeeta:1 })
        res.send(drAvailTime)
    } catch (error) {
        res.status(404).send(error)
    }
})

// Get one avalibleTime 
router.get('/:id', async (req, res) => {
    try {
        const drAvailTime = await DrAvailTime.findById({ _id: req.params.id })
        .populate({ path: 'doctorId', select: 'firstName LastName'})
        .populate({ path: 'branchId', select: 'name', populate: { path: 'areaId', select: 'name' }})
        res.status(200).send(drAvailTime)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Remove DrAvailTime 
router.delete('/remove/:id', async (req, res) => {
    const drAvailTime = await DrAvailTime.findByIdAndDelete({_id: req.params.id})
    try {
        res.status(201).send(drAvailTime)
    } catch (e) {
        res.status(400).send(e)
    }
})

// AvalibleTime for one Doctor in one branch 
router.get('/AvalibleTime/search', async (req, res) => {
    try {
        let query = {};
        if (req.query.doctorId) {
            query.doctorId = req.query.doctorId
        }
        if (req.query.branchId) {
            query.branchId = req.query.branchId
        }
        const avalibleTime = await DrAvailTime.find(query)
            .populate({path: 'doctorId', select: 'firstName LastName email'})
            .populate({path: 'branchId', select: 'name',populate:{path: 'hospitalId',selesct : 'name'}})
            .populate({path: 'branchId', select: 'name',populate:{path: 'clinicId',selesct : 'name'}})
        res.send(avalibleTime)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router;