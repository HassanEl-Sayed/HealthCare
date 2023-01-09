var express = require('express');
var router = express.Router();
const XRay = require('../models/XRay')
const authXray = require('../middleware/authXray')

//Add XRay
router.post('/add', async (req, res) => {
    const xray = new XRay(req.body)
    try {
        await xray.save()
        res.status(201).send(xray)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Login
router.post('/login',async (req, res) => {
    try {
        const xray = await XRay.findByCredentials(req.body.email, req.body.password)
        const token = await xray.generateAuthToken()
        res.send({ xray, token })
    } catch (e) {
        res.status(400).send()
    }
})


//get all XRays
router.get('/', async (req, res) => {
    try {
        const xray = await XRay.find({})
        .populate({ path: 'typeId', select: 'type'})
        const xrays = xray.map(doc=>{
            return{
                id:doc._id,
                name :doc.name,
                FawryId: doc.FawryId,
                description: doc.description,
                types: doc.typeId,
                profile : '/xrays/find/'+doc._id
            }
        })
        res.send(xrays)
    } catch (error) {
        res.status(404).send(error)
    }
})
// One XRay 
router.get('/find/:id', async (req, res) => {
    try {
        const xray = await XRay.findById({_id: req.params.id}).populate({path:'typeId', select:'type'}) 
        res.status(200).send(xray)
    } catch (e) {
        res.status(500).send(e)
    }
})
// Branches of one XRay 
router.get('/branches/:id', async (req, res) => {
    try {
        const xray = await XRay.findById({_id: req.params.id})
                                    .populate({ path: 'branches', select: 'name ', populate: { path: 'areaId', select: 'name' }, populate: { path: 'governorateId', select: 'name' } })

        res.status(200).send(xray.branches)
    } catch (e) {
        res.status(500).send(e)
    }
})
//Remove Lab 
router.delete('/remove/:id', async (req, res) => {
    const xray = await XRay.findByIdAndDelete({_id: req.params.id})
    try {
        res.status(201).send(xray)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;