var express = require('express');
var router = express.Router();
const Clinic = require('../models/Clinic')

//Add clinic
router.post('/add', async (req, res) => {
    const clinic = new Clinic(req.body)
    try {
        await clinic.save()
        res.status(201).send(clinic)
    } catch (e) {
        res.status(400).send(e)
    }
})
//get all clinic
router.get('/', async (req, res) => {
    try {
        const clinic = await Clinic.find({})
        .populate({ path: 'specialtiesId', select: 'specialties'})
        const clinics = clinic.map(doc=>{
            return{
                id:doc._id,
                name :doc.name,
                FawryId: doc.FawryId,
                description: doc.description,
                specialties: doc.specialtiesId,
                profile : '/clinics/'+doc._id
            }
        })
        res.send(clinics)
    } catch (error) {
        res.status(404).send(error)
    }
})
// One clinic 
router.get('/:id', async (req, res) => {
    try {
        const clinic = await Clinic.findById({_id: req.params.id}).populate('specialtiesId') 
        res.status(200).send(clinic)
    } catch (e) {
        res.status(500).send(e)
    }
})
// Branches of one clinic 
router.get('/branches/:id', async (req, res) => {
    try {
        const clinic = await Clinic.findById({_id: req.params.id})
                                    .populate({ path: 'branches', select: 'name ', populate: { path: 'areaId', select: 'name' }})

        res.status(200).send(clinic.branches)
    } catch (e) {
        res.status(500).send(e)
    }
})
//Remove clinic 
router.delete('/remove/:id', async (req, res) => {
    const clinic = await Clinic.findByIdAndDelete({_id: req.params.id})
    try {
        res.status(201).send(clinic)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;


