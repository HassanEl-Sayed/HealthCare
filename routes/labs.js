var express = require('express');
var router = express.Router();
const Lab = require('../models/Lab')
const authLab = require('../middleware/authLab')

//Add lab
router.post('/add', async (req, res) => {
    const lab = new Lab(req.body)
    try {
        await lab.save()
      //  const token = await lab.generateAuthToken()
        res.status(201).send({lab})
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Login
router.post('/login',async (req, res) => {
    try {
        const lab = await Lab.findByCredentials(req.body.email, req.body.password)
        const token = await lab.generateAuthToken()
        res.send({ lab, token })
    } catch (e) {
        res.status(400).send()
    }
})

//get all labs
router.get('/', async (req, res) => {
    try {
        const lab = await Lab.find({})
        .populate({ path: 'typeId', select: 'type'})
        const labs = lab.map(doc=>{
            return{
                id:doc._id,
                name :doc.name,
                FawryId: doc.FawryId,
                description: doc.description,
                types: doc.typeId,
                profile : '/labs/find/'+doc._id
            }
        })
        res.send(labs)
    } catch (error) {
        res.status(404).send(error)
    }
})
// One lab 
router.get('/find/:id', async (req, res) => {
    try {
        const lab = await Lab.findById({_id: req.params.id}).populate({path:'typeId', select:'type'}) 
        res.status(200).send(lab)
    } catch (e) {
        res.status(500).send(e)
    }
})
// Branches of one Lab 
router.get('/branches/:id', async (req, res) => {
    try {
        const lab = await Lab.findById({_id: req.params.id})
                                    .populate({ path: 'branches', select: 'name ', populate: { path: 'areaId', select: 'name' }})

        res.status(200).send(lab.branches)
    } catch (e) {
        res.status(500).send(e)
    }
})
//Remove Lab 
router.delete('/remove/:id', async (req, res) => {
    const lab = await Lab.findByIdAndDelete({_id: req.params.id})
    try {
        res.status(201).send(lab)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;


