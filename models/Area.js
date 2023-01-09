const mongoose = require('mongoose')

const areaSchema = new mongoose.Schema({

    name:{
        type : String,
        required:true
    },
    governorateId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Governorate'
    }
        
})

areaSchema.virtual('user', {
    ref: 'User',
    localField: '_id',
    foreignField: 'Area'
})


const Area = mongoose.model('Area', areaSchema)

module.exports = Area


