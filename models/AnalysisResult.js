const mongoose = require('mongoose')

const AnalysisResultSchema = new mongoose.Schema({
    info: {
        type: Date,
        default: Date.now
    },
    result: {
        type: String,
    },
    branchId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BranchesXL'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const AnalysisResult = mongoose.model('AnalysisResult' , AnalysisResultSchema)
module.exports = AnalysisResult