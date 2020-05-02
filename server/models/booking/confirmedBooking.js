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
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        index: { expires: '1d' }
    }
})

module.exports = mongoose.model('ConfirmedBooking', BookingSchema)
