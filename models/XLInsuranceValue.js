const mongoose = require('mongoose')

const XLInsValueSchema = new mongoose.Schema({
    
    Discount: {
        type: Number,
        required:true
    },
    labId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab'
    },
    typeId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Types'
    },
    xrayId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'XRay'
    },
    InsuranceId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Insurance'
    }
})

const XLInsValue= mongoose.model('XLInsValue' , XLInsValueSchema)
module.exports = XLInsValue