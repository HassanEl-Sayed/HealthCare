const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const DrSchema = new mongoose.Schema({
    firstName: {
        type: String,
       required: true,
        trim: true
    },
    LastName: {
        type: String,
       required: true,
        trim: true
    },
    birthDate: {
        type: Date,
    },
    phoneNumber: {
        type: String,
        length: 11,
       required:true,
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
    avatar :{
        type: Buffer
    },
    tokens:[{
        token:{
            type : String,
            required:true,
        }
    }],
    specialtiesId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Specialties'
    },
    titleId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Title'
    },
    genderId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gender'
    },
    BranchId:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BranshesHC'
    }],
    avatar:{
        type:Buffer
    },
    avgRating:{
        type:Number
    }
})
DrSchema.virtual('rate', {
    ref: 'Rating',
    localField: '_id',
    foreignField: 'doctorId'
})
DrSchema.virtual('availTime', {
    ref: 'DrAvailTime',
    localField: '_id',
    foreignField: 'doctorId'
})
DrSchema.virtual('booked', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'DrAvailTime.doctorId'
})
// Hash the plain text password before saving
DrSchema.pre('save', async function (next) {
    const doctor = this
    if (doctor.isModified('password')) {
        doctor.password = await bcrypt.hash(doctor.password, 8)
    }
    next()
})


//For Login
DrSchema.statics.findByCredentials = async (email, password) => {
    const doctor = await Doctor.findOne({ email })
    if (!doctor) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, doctor.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return doctor
}

//For Token
DrSchema.methods.generateAuthToken = async function () {
    const doctor = this
    const token = jwt.sign({ _id: doctor._id.toString()}, process.env.JWT_SECRETDOCTOR)
    doctor.tokens = doctor.tokens.concat({ token })
    await doctor.save()
    return token
}
//to delete objects
DrSchema.methods.toJSON = function () {
    const doctor = this
    const doctorObject = doctor.toObject()
    
    delete doctorObject.password
    delete doctorObject.tokens
    return doctorObject
}

const Doctor = mongoose.model('Doctor', DrSchema)

module.exports = Doctor