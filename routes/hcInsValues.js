var express = require('express');
var router = express.Router();
const HCInsValue = require('../models/HCInsuranceValue');


//Add HCInsuranceValue
router.post('/add', async (req, res) => {

    const hcInsValue = new HCInsValue(req.body)
    try {
        await hcInsValue.save()
        res.status(201).send(hcInsValue)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get all hcInsuranceValues
router.get('/', async (req, res) => {
    try {
       const hcInsuranceValue = await HCInsValue.find({})
       .populate({ path: 'specialtiesId', select: 'specialties' }) 
       .populate({ path: 'InsuranceId', select: 'name' }) 
       .populate({ path: 'hospitalId', select: 'name' })
       res.send(hcInsuranceValue)
    } catch (error) {
        res.status(404).send(error)
    }
})

//Get One insuranceType 
router.get('/:id', async (req, res) => {
    try {
        const hcInsuranceValue = await HCInsValue.findById({_id: req.params.id}).populate('specialtiesId') 
        res.status(200).send(hcInsuranceValue)
    } catch (e) {
        res.status(500).send(e)
    }
})
//filter By [].
router.get('/search/filter', async (req, res) => {
    try {
        let query = {};
        if (req.query.specialties) {
            query.specialtiesId = req.query.specialties
        }
        if (req.query.insurance) {
            query.InsuranceId = req.query.insurance
        }
        if (req.query.discountFrom && req.query.discountTo ) {
            query.$and = [
                { "Discount": { $gte: req.query.discountFrom, $lte: req.query.discountTo} }
            ];
        }
        const insurance = await HCInsValue.find(query)
                .populate({ path: 'specialtiesId', select: 'specialties' }) 
                .populate({ path: 'InsuranceId', select: 'name' }) 
                .populate({ path: 'hospitalId', select: 'name' })
                .sort({Discount:-1 })
        res.send(insurance)
    } catch (error) {
        res.status(404).send(error)
    }
})

module.exports = router;