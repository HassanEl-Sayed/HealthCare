const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const xRaySchema = mongoose.Schema({
    name : {
        type : String ,
        required : true ,
    },
    image :{
        type: Buffer
    },
    description:{
        type: String,
        required: true
    },
    typeId:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Types'
    }]
})

xRaySchema.virtual('branches', {
    ref: 'BranshesXL',
    localField: '_id',
    foreignField: 'xrayId'
})

const XRay = mongoose.model('XRay' , xRaySchema)
module.exports = XRay