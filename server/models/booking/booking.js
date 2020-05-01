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
    riderLat: {
        type: String,
        required: true
    },
    riderLong: {
        type: String,
        required: true
    },
    driverLat: {
        type: String,
        required: true
    },
    driverLong: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        index: { expires: '3m' }
    }
})

module.exports = mongoose.model('Booking', BookingSchema)
