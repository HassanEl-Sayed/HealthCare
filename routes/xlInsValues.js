var express = require('express');
var router = express.Router();
const XLInsValue = require('../models/XLInsuranceValue');


//Add HCInsuranceValue
router.post('/add', async (req, res) => {

    const xlInsValue = new XLInsValue(req.body)
    try {
        await xlInsValue.save()
        res.status(201).send(xlInsValue)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get all XLInsuranceValues
router.get('/', async (req, res) => {
    try {
       const xlInsValue = await XLInsValue.find({})
       .populate({ path: 'typeId', select: 'type' }) 
       .populate({ path: 'InsuranceId', select: 'name' }) 
       .populate({ path: 'labId', select: 'name' })
       .populate({ path: 'xrayId', select: 'name' })
       res.send(xlInsValue)
    } catch (error) {
        res.status(404).send(error)
    }
})

//Get One insuranceType 
router.get('/:id', async (req, res) => {
    try {
        const xlInsValue = await XLInsValue.findById({_id: req.params.id}).populate('typeId') 
        res.status(200).send(xlInsValue)
    } catch (e) {
        res.status(500).send(e)
    }
})
//Filter
router.get('/search/filter', async (req, res) => {
    try {
        let query = {};
        if (req.query.type) {
            query.typeId = req.query.type
        }
        if (req.query.insurance) {
            query.InsuranceId = req.query.insurance
        }
        if (req.query.discountFrom && req.query.discountTo ) {
            query.$and = [
                { "Discount": { $gte: req.query.discountFrom, $lte: req.query.discountTo} }
            ];
        }
        const insurance = await XLInsValue.find(query)
                .populate({ path: 'typeId', select: 'type' }) 
                .populate({ path: 'InsuranceId', select: 'name' }) 
                .populate({ path: 'labId', select: 'name' })
                .populate({ path: 'xrayId', select: 'name' })
                .sort({Discount:-1 })
        res.send(insurance)
    } catch (error) {
        res.status(404).send(error)
    }
})
module.exports = router;