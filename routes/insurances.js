var express = require('express');
var router = express.Router();
const InsuranceType = require('../models/InsuranceType');
const Insurance = require('../models/Insurance');

//Add InsuranceType
router.post('/insuranceType/add', async (req, res) => {

    const insuranceType = new InsuranceType(req.body)
    try {
        await insuranceType.save()
        res.status(201).send(insuranceType)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Add Insurance
router.post('/insurance/add', async (req, res) => {
    const insurance = new Insurance(req.body)
    try {
        await insurance.save() 
        res.status(201).send(insurance)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get all InsuranceType
router.get('/insuranceTypes', async (req, res) => {
    try {
       const insuranceType = await InsuranceType.find({})
       const insurances = insuranceType.map(doc=>{
           return{
               _id:doc._id,
               name :doc.name,
               insurances : '/insuranceType/'+doc._id
           }
       })
       res.send(insurances)
    } catch (error) {
        res.status(404).send(error)
    }
})

//Get One insuranceType 
router.get('/insuranceType/:id', async (req, res) => {
    try {
        const insuranceType = await InsuranceType.findById({_id: req.params.id}).populate('insurance') 
        res.status(200).send(insuranceType.insurance)
    } catch (e) {
        res.status(500).send(e)
    }
})

//get all insurance
router.get('/insurances', async (req, res) => {
    try {
        const insurance = await Insurance.find({}).populate('insuranceTypeId')
        res.send(insurance)
    } catch (error) {
        res.status(404).send(error)
    }
})

module.exports = router;