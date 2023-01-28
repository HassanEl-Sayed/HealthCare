var express = require('express');
var router = express.Router();
const Governorate = require('../models/Governorate')
const Area = require('../models/Area')


//Add Governorate
router.post('/Governorates/addGovernorate', async (req, res) => {
    const governorate = new Governorate(req.body)
    try {
        await governorate.save()
        res.status(201).send(governorate)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Add area
router.post('/Area/addArea', async (req, res) => {
    const area = new Area(req.body)
    try {
        await area.save()
        res.status(201).send(area)
    } catch (e) {
        res.status(400).send(e)
    }
})
//get all Governorate
router.get('/Governorate', async (req, res) => {
    try {
       const governorate = await Governorate.find({}).populate({path:'area', select: 'name'})
       const area = governorate.map(doc=>{
           return{
               id:doc._id,
               name :doc.name,
               areas:doc.area,
              // areaAPI : '/Governorate/'+doc._id
           }
       })
       res.send(area)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

//Get All Governerate 's area 
router.get('/Governorate/:id', async (req, res) => {
    try {
        const governorate = await Governorate.findById({_id: req.params.id}).populate({path:'area', select:'name'}) 
        res.status(200).send(governorate.area)
    } catch (e) {
        res.status(500).send(e)
    }
})

//get all area
router.get('/Area', async (req, res) => {
    try {
        const area = await Area.find({}).populate('governorateId')
        res.send(area)
    } catch (error) {
        res.status(404).send(error)
    }
})



module.exports = router;
