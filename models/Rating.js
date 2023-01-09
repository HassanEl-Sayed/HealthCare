const mongoose = require('mongoose')
const validator = require('validator')
const Doctor = require('../models/Doctor')

const ratingSchema = new mongoose.Schema({
       
    Review: {
        type: String,
    },
    ratingValue: {
        type: Number
    },
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Doctor'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: 'User'
    },

})
//For Avg rating
ratingSchema.statics.getAvgRating = async function(doctor){
    const obj = await this.aggregate([
        {
            $match:{doctorId:doctor}
        },
        {
            $group:{
                _id:'$doctorId',
                avgRating:{ $avg:'$ratingValue'}
            }
        }
    ]);
    try {
        await this.model('Doctor').findByIdAndUpdate(doctor,{
            avgRating : obj[0].avgRating
        });
    } catch (err) {
        console.error(err)
    }
};

ratingSchema.post('save',function(){
    this.constructor.getAvgRating(this.doctorId);
});

ratingSchema.pre('remove',function(){
    this.constructor.getAvgRating(this.doctorId);
});



const Rating = mongoose.model('Rating', ratingSchema)
module.exports = Rating
