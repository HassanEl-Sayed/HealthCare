var express = require('express');
var router = express.Router();
const Types = require('../models/Types')


//Add type
router.post('/add', async (req, res) => {
    const types = new Types(req.body)
    try {
        await types.save()
        res.status(201).send(types)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get all Types
router.get('/', async (req, res) => {
    try {
        const type = await Types.find({})
        const types = type.map(doc=>{
            return{
                id:doc._id,
                type :doc.type,
                // labs : '/types/labs/'+doc._id,
                // xrays : '/types/xrays/'+doc._id
            }
        })
        res.send(types)
    } catch (error) {
        res.status(404).send(error)
    }
})

//Get All labs have this type 
router.get('/labs/:id', async (req, res) => {
    try {
        const types = await Types.findById({_id: req.params.id}).populate('labs') 
        res.status(200).send(types.labs)
    } catch (e) {
        res.status(500).send(e)
    }
})
//Get All xrays have this type 
router.get('/xrays/:id', async (req, res) => {
    try {
        const types = await Types.findById({_id: req.params.id}).populate('xrays') 
        res.status(200).send(types.xrays)
    } catch (e) {
        res.status(500).send(e)
    }
})
// AvalibleTime for one type 
router.get('/AvalibleTime/:id', async (req, res) => {
    try {
        const type = await Types.findById({ _id: req.params.id })
     //  .populate({ path: 'branchId', select: 'name',populate: { path: 'areaId', select: 'name' }})
      .populate({
        path: 'availTimes', select: 'day timeFrom timeTo vezeeta',
        populate: {
            path: 'branchId', select: 'name',
            populate: { path: 'areaId', select: 'name' }
        }
    })
        res.status(200).send(type.availTimes)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.get('/avalibleTime', async (req, res) => {
    try {
        let query = {};

        if (req.query.typeId) {
            query.typeId = req.query.typeId
        }
        if (req.query.branchId) {
            query.branchId = req.query.branchId
        }

        const type = await Types.find(query)
        .populate({
            path: 'availTimes', select: 'day timeFrom timeTo vezeeta',
            populate: {
                path: 'branchId', select: 'name',
                populate: { path: 'areaId', select: 'name' }
            }
        })

        res.status(200).send(type.availTimes)
    } catch (error) {
        res.status(404).send(error.message)
    }
})




module.exports = router;
