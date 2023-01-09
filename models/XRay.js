const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const xRaySchema = mongoose.Schema({
    name : {
        type : String ,
        // required : true ,
     },
    // email: {
    //     type: String,
    //     unique: true,
    //     // required: true,
    //     trim: true,
    //     lowercase: true,
    // },
    // password: {
    //     type: String,
    //     // required: true,
    //    // minlength: 7,
    //     trim: true,
    // },
    // tokens:[{
    //     token:{
    //         type : String,
    //         required:true
    //     }
    // }],
    image :{
        type: Buffer
    },
    description:{
        type: String,
       // required: true
    },
    typeId:[{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Types'
    }]
})

xRaySchema.virtual('branches', {
    ref: 'BranshesXL',
    localField: '_id',
    foreignField: 'xrayId'
})

// // Hash the plain text password before saving
// xRaySchema.pre('save', async function (next) {
//     const xray = this
//     if (xray.isModified('password')) {
//         xray.password = await bcrypt.hash(xray.password, 8)
//     }
//     next()
// })

// //For Login
// xRaySchema.statics.findByCredentials = async (email, password) => {
//     const xray = await XRay.findOne({ email })
//     if (!xray) {
//         throw new Error('Unable to login')
//     }
//     const isMatch = await bcrypt.compare(password, xray.password)
//     if (!isMatch) {
//         throw new Error('Unable to login')
//     }
//     return xray
// }
// //For Token
// xRaySchema.methods.generateAuthToken = async function () {
//     const xray = this
//     const token = jwt.sign({ _id: xray._id.toString()}, process.env.JWT_SECRETXRAY)
//     xray.tokens = xray.tokens.concat({ token })
//     await xray.save()
//     return token
// }
// //to delete objects
// xRaySchema.methods.toJSON = function () {
//     const xray = this
//     const xrayObject = xray.toObject()
    
//     delete xrayObject.password
//     delete xrayObject.tokens
//     return xrayObject
// }

const XRay = mongoose.model('XRay' , xRaySchema)
module.exports = XRay