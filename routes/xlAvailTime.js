var express = require('express');
var router = express.Router();
const XLavalibleTime = require('../models/XLavalibleTime');


//Add xlavalibleTime
router.post('/add', async (req, res) => {

    const xlavalibleTime = new XLavalibleTime(req.body)
    try {
        await xlavalibleTime.save()
        res.status(201).send(xlavalibleTime)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get all xlavalibleTime
router.get('/', async (req, res) => {
    try {
       const xlavalibleTime = await XLavalibleTime.find({})
             .populate({ path: 'typeId', select: 'type'})
             .populate({ path: 'branchId', select: 'name'  ,populate: { path: 'areaId', select: 'name' }})
       const tables = xlavalibleTime.map(doc=>{
           return{
            id:doc._id,
            day:doc.day,
            timeFrom:doc.timeFrom,
            timeTo:doc.timeTo,
            vezeeta: doc.vezeeta,
            branchId:doc.branchId,
            typeId:doc.typeId,
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
            query.$or = [
                {"vezeeta": {$lte: req.query.moneyTo,$gte: req.query.moneyFrom}}
            ];
        }
        const xlavalibleTime = await XLavalibleTime.find(query)
        .populate({ path: 'typeId', select: 'type'})
        .populate({ path: 'branchId', select: 'name'  ,populate: { path: 'areaId', select: 'name' }})
        .sort({vezeeta:1 })
        res.send(xlavalibleTime)
    } catch (error) {
        res.status(404).send(error)
    }
})

// AvalibleTime for one lab/xray branch with one type
router.get('/AvalibleTime/search', async (req, res) => {
    try {
        let query = {};
        if (req.query.typeId) {
            query.typeId = req.query.typeId
        }
        if (req.query.branchId) {
            query.branchId = req.query.branchId
        }
        const avalibleTime = await XLavalibleTime.find(query)
            .populate({path: 'typeId', select: 'type'})
            .populate({path: 'branchId', select: 'name',populate:{path: 'labId',selesct : 'name'}})
            .populate({path: 'branchId', select: 'name',populate:{path: 'xrayId',selesct : 'name'}})
        res.send(avalibleTime)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


//Remove XLavalibleTime 
router.delete('/remove/:id', async (req, res) => {
    const xlavalibleTime = await XLavalibleTime.findByIdAndDelete({_id: req.params.id})
    try {
        res.status(201).send(xlavalibleTime)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;