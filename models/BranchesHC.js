const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const HCBranchesSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    areaId: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Area'
    },
    hospitalId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    clinicId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    },
    tokens:[{
        token:{
            type : String,
            required:true
        }
    }],
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        trim: true,
    },
    image :{
        type: Buffer
    }
})

HCBranchesSchema.virtual('doctors', {
    ref: 'Doctor',
    localField: '_id',
    foreignField: 'BranchId'
})
// Hash the plain text password before saving
HCBranchesSchema.pre('save', async function (next) {
    const branchesHC = this
    if (branchesHC.isModified('password')) {
        branchesHC.password = await bcrypt.hash(branchesHC.password, 8)
    }
    next()
})

//For Login
HCBranchesSchema.statics.findByCredentials = async (email, password) => {
    const branchesHC = await BranshesHC.findOne({ email })
    if (!branchesHC) {
        throw new Error('Not found')
    }
    const isMatch = await bcrypt.compare(password, branchesHC.password)
    if (!isMatch) {
        throw new Error('Pass uncorrect')
    }
    return branchesHC
}
//For Token
HCBranchesSchema.methods.generateAuthToken = async function () {
    const branchesHC = this
    const token = jwt.sign({ _id: branchesHC._id.toString()},process.env.JWT_SECRETBRANCHESHC)
    branchesHC.tokens = branchesHC.tokens.concat({ token })
    await branchesHC.save()
    return token
}
//to delete objects
HCBranchesSchema.methods.toJSON = function () {
    const branchesHC = this
    const branchesHCObject = branchesHC.toObject()
    delete branchesHCObject.password
    delete branchesHCObject.tokens
    return branchesHCObject
}

const BranshesHC = mongoose.model('BranshesHC', HCBranchesSchema)

module.exports = BranshesHC