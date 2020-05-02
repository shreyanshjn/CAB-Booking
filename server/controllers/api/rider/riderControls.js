var RiderSchema = require('../../../models/rider/rider')
var fields = 'name email gender latitude longitude rides phone' 

exports.updateLocation = async (req, res) => {
    var { latitude, longitude }  = req.body
    var _id = req.locals._id
    if(!latitude || !longitude)
    {
        return res.status(400).send({
            success: false,
            msg: 'Incomplete info received'
        })
    }
    var updatedData = { latitude, longitude }
    try
    {
        var data = await RiderSchema.findOneAndUpdate({_id:_id}, updatedData, {
            new: true
        })
        .select(fields)
        .exec()
        if(!data)
        {
            return res.status(400).send({
                success: false,
                msg: 'Error updating driver location'
            })
        }
        return res.status(200).send({
            success: true,
            data: data,
            msg: 'Successfully updated driver location'
        })
    }
    catch(error)
    {
        return res.status(400).send({
            success: false,
            error: error,
            msg: 'Something went wrong'
        })
    }
}

exports.getLiveLocation = async (req, res) => {
    var _id = req.body._id
    if(!_id)
    {
        return res.status(400).send({
            success: false,
            msg: 'Incomplete info received'
        })
    }
    try
    {
        var data = await RiderSchema.findOne({_id:_id})
            .select('longitude latitude email')
        if(!data)
        {
            return res.status(400).send({
                success: false,
                msg: 'No user found'
            })
        }
        return res.status(200).send({
            success: true,
            msg: 'Rider location received',
            data: data
        })
    }
    catch(error)
    {
        res.status(400).send({
            success: false,
            error: error,
            msg: 'Something went wrong'
        })
    }
}
