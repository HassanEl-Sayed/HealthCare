var express = require('express');
var router = express.Router();
const Hospital = require('../models/Hospital')

//Add hospital
router.post('/add', async (req, res) => {
    const hospital = new Hospital(req.body)
    try {
        await hospital.save()
        res.status(201).send(hospital)
    } catch (e) {
        res.status(400).send(e)
    }
})
//get all Hospitals
router.get('/', async (req, res) => {
    try {
        const hospital = await Hospital.find({})
        .populate({ path: 'specialtiesId', select: 'specialties'})
        const hospitals = hospital.map(doc=>{
            return{
                id:doc._id,
                name :doc.name,
                FawryId: doc.FawryId,
                description: doc.description,
                specialties: doc.specialtiesId,
                profile : '/hospitals/'+doc._id
            }
        })
        res.send(hospitals)
    } catch (error) {
        res.status(404).send(error)
    }
})
// One Hospital 
router.get('/:id', async (req, res) => {
    try {
        const hospital = await Hospital.findById({_id: req.params.id}).populate('specialtiesId') 
        res.status(200).send(hospital)
    } catch (e) {
        res.status(500).send(e)
    }
})
// Branches of one Hospital 
router.get('/branches/:id', async (req, res) => {
    try {
        const hospital = await Hospital.findById({_id: req.params.id})
                                       .populate({ path: 'branches', select: 'name ', populate: { path: 'areaId', select: 'name' }})

        res.status(200).send(hospital.branches)
    } catch (e) {
        res.status(500).send(e)
    }
})
//Remove Hospital 
router.delete('/remove/:id', async (req, res) => {
    const hospital = await Hospital.findByIdAndDelete({_id: req.params.id})
    try {
        res.status(201).send(hospital)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;
