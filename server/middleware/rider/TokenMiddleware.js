var moment = require('moment')
var riderToken = require('../../models/rider/rider_token.js')

exports.verifyToken = async (req, res, next) => {
    console.log(req.data)
    var authHeader = req.get('Authorization')
    if (authHeader !== undefined) {
        var user = await riderToken.findOne({ token: authHeader })
        if(!user)
        {
            res.status(403).send({
                success: false,
                msg: 'Invalid Token'
            })
        }
        else if(moment() > user.expirationTime) {
            res.status(403).send({
                success: false,
                msg: 'Token expired'
            })
        }
        else {
            req.locals = {
                _id: user._userId,
            }
            next()
        }
    }
    else {
        res.status(401).send({
            success: false,
            msg: 'Token not found'
        })
    }
}
