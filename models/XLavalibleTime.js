const mongoose = require('mongoose')

const XLavalibleTimeSchema = new mongoose.Schema({
    day: {
        type: String,
        // required:true
    },
    timeFrom: {
        type: String,
        // required:true
    },
    timeTo: {
        type: String,
        // required:true
    },
    vezeeta:{
        type:Number,
        // require:true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: 'BranchesXL'
    },
    typeId:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Types'
    }
})

 const XLavalibleTime= mongoose.model('XLavalibleTime' , XLavalibleTimeSchema)
 module.exports = XLavalibleTime