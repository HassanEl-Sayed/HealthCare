const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const XLBranchesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "Password"')
            }
        }
    },
    areaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Area'
    },
    labId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab'
    },
    xrayId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'XRay'
    },
    tokens:[{
        token:{
            type : String,
            required:true
        }
    }],
    types:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Types'
    }],
    image :{
        type: Buffer
    }

})
XLBranchesSchema.virtual('type', {
    ref: 'Types',
    localField: '_id',
    foreignField: 'branchId'
})

// Hash the plain text password before saving
XLBranchesSchema.pre('save', async function (next) {
    const branchesXL = this
    if (branchesXL.isModified('password')) {
        branchesXL.password = await bcrypt.hash(branchesXL.password, 8)
    }
    next()
})

//For Login
XLBranchesSchema.statics.findByCredentials = async (email, password) => {
    const branchesXL = await BranchesXL.findOne({ email })
    if (!branchesXL) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, branchesXL.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return branchesXL
}
//For Token
XLBranchesSchema.methods.generateAuthToken = async function () {
    const branchesXL = this
    const token = jwt.sign({ _id: branchesXL._id.toString()},process.env.JWT_SECRETBRANCHESXL)
    branchesXL.tokens = branchesXL.tokens.concat({ token })
    await branchesXL.save()
    return token
}

const BranchesXL = mongoose.model('BranchesXL', XLBranchesSchema)

module.exports = BranchesXL