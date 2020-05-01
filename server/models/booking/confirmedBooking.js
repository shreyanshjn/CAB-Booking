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
        index: { expires: '1d' }
    }
})

module.exports = mongoose.model('ConfirmedBooking', BookingSchema)
