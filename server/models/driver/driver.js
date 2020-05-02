var mongoose = require('mongoose')
var Schema = mongoose.Schema

var DriverSchema = new Schema({
    name: {
        type     : String,
        trim     : true,
        required : [true, 'name is required'],
        lowercase: true
    },
    email: {
        type      : String,
        trim      : true,
        required  : [true, 'email is required'],
        lowercase : true,
        unique    : true
    },
    password: {
        type : String,
        trim : true
    },
    gender: {
        type     : String,
        required : [true, 'gender is required'],
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String
    },
    activeStatus: {
        type: Boolean,
        default: false
    },
    phone : {
        type: Number,
        required: [true, 'phone is required']
    },
    rides: [{
        _riderId: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Rider'
        },
        time: {
            type: String, 
            default: Date.now,
        },
        fare: {
            type: String,
        }
    }]
})

module.exports = mongoose.model('Driver', DriverSchema)
