const mongoose = require('mongoose')

const DiagnosisSchema = new mongoose.Schema({
    info: {
        type: Date,
        default: Date.now
    },
    Diagnosis:{
        type: String,
    },
    medicines:{
        type: String,
    },
    AnalysisNeeded:{
        type: String,
    },
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})


const Diagnosis = mongoose.model('Diagnosis', DiagnosisSchema)

module.exports = Diagnosis