const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        //required: true,
        trim: true
    },
    LastName: {
        type: String,
        //required: true,
        trim: true
    },
    birthDate: {
        type: Date,
    },
    phoneNumber: {
        type: String,
        length: 11,
        //required:true,
    },
    diseases: {
        type: String,
    },
    insuranceNo: {
        type: Number,
        trim: true,
    },
    insuranceExpireDate: {
        type: Date,
        // validate(value) {
        //     if (value < $currentDate) {
        //         throw new Error('It is expired')
        //     }
        // } 
    },
    email: {
        type: String,
        unique: true,
        // required: true,
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
        // required: true,
       // minlength: 7,
        trim: true,
        // validate(value) {
        //     if (value.toLowerCase().includes('password')) {
        //         throw new Error('Password cannot contain "Password"')
        //     }
        // }
    },
    avatar:{
        type:String
    },
    insuranceCard:{
        type:String
    },
    tokens:[{
        token:{
            type : String,
            required:true
        }
    }],
     AreaId: {
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: 'Area'
    },
    InsuranceId: {
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: 'Insurance'
    },
    genderId:{
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: 'Gender'
    },
    userNumber:{
        //type:
    }
},{
    timestamps:true
})
userSchema.virtual('booking', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'userId'
})

userSchema.virtual('diagnosis', {
    ref: 'Diagnosis',
    localField: '_id',
    foreignField: 'userId'
})

userSchema.virtual('analysisResult', {
    ref: 'AnalysisResult',
    localField: '_id',
    foreignField: 'userId'
})

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//For Login
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}
//For Token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRETUSER)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
//to delete objects
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    return userObject
}


const User = mongoose.model('User', userSchema)

module.exports = User