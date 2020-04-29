var mongoose = require('mongoose')
var Schema   =  mongoose.Schema

var TokenSchema = new Schema({
    _userId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Rider'
    },
    token: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 864000
    }
})

module.exports = mongoose.model('Rider_token', TokenSchema)
