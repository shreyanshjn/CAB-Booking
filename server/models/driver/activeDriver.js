var mongoose = require('mongoose')
var Schema = mongoose.Schema

var DriverSchema = new Schema({
    driverId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Driver'
    },
    active: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '20s' }
    }
})

module.exports = mongoose.model('Active_driver', DriverSchema)
