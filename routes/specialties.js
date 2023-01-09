var express = require('express');
var router = express.Router();
const Specialits = require('../models/Specialits')


//Add specialties
router.post('/addspecialties', async (req, res) => {
    const specialits = new Specialits(req.body)
    try {
        await specialits.save()
        res.status(201).send(specialits)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get all specialits
router.get('/', async (req, res) => {
    try {
        const specialit = await Specialits.find({})
        const doctors = specialit.map(doc=>{
            return{
                id:doc._id,
                specialties :doc.specialties,
                doctors : '/specialties/'+doc._id
            }
        })
        res.send(doctors)
    } catch (error) {
        res.status(404).send(error)
    }
})

//Get All specialits 's Doctor 
router.get('/:id', async (req, res) => {
    try {
        const specialits = await Specialits.findById({_id: req.params.id}).populate('doctors') 
        res.status(200).send(specialits.doctors)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;
