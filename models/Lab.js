const mongoose = require('mongoose')


const labSchema = mongoose.Schema({
    name : {
        type : String ,
        // required : true ,
    },
    // email: {
    //     type: String,
    //     unique: true,
    //     // required: true,
    //     trim: true,
    //     lowercase: true
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
labSchema.virtual('branches', {
    ref: 'BranshesXL',
    localField: '_id',
    foreignField: 'labId'
})

// Hash the plain text password before saving
// labSchema.pre('save', async function (next) {
//     const lab = this
//     if (lab.isModified('password')) {
//         lab.password = await bcrypt.hash(lab.password, 8)
//     }
//     next()
// })

//For Login
// labSchema.statics.findByCredentials = async (email, password) => {
//     const lab = await Lab.findOne({ email })
//     if (!lab) {
//         throw new Error('Unable to login')
//     }
//     const isMatch = await bcrypt.compare(password, lab.password)
//     if (!isMatch) {
//         throw new Error('Unable to login')
//     }
//     return lab
// }
// //For Token
// labSchema.methods.generateAuthToken = async function () {
//     const lab = this
//     const token = jwt.sign({ _id: lab._id.toString()}, process.env.JWT_SECRETLAB)
//     lab.tokens = lab.tokens.concat({ token })
//     await lab.save()
//     return token
// }
//to delete objects
// labSchema.methods.toJSON = function () {
//     const lab = this
//     const labObject = lab.toObject()
    
//     delete labObject.password
//     delete labObject.tokens
//     return labObject
// }

const Lab = mongoose.model('Lab' , labSchema)
module.exports = Lab