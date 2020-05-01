var mongoose = require('mongoose')
var Schema = mongoose.Schema

var DriverSchema = new Schema({
    _userId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Driver'
    },
    active: {
        type: Boolean,
        default: false
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '1m' }
    }
})

module.exports = mongoose.model('Active_driver', DriverSchema)
