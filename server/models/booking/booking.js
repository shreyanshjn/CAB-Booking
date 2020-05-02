var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BookingSchema = new Schema({
    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Rider'
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Driver'
    },
    active: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: '2m'
    }
})

module.exports = mongoose.model('Booking', BookingSchema)
