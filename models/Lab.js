const mongoose = require('mongoose')


const labSchema = mongoose.Schema({
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
labSchema.virtual('branches', {
    ref: 'BranshesXL',
    localField: '_id',
    foreignField: 'labId'
})


const Lab = mongoose.model('Lab' , labSchema)
module.exports = Lab