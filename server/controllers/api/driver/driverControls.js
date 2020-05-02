var DriverSchema = require('../../../models/driver/driver')
var ActiveDriverSchema = require('../../../models/driver/activeDriver')
var fields = 'name email gender latitude longitude activeStatus rides phone' 

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
        var data = await DriverSchema.findOneAndUpdate({_id:_id}, updatedData, {
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

exports.toggleActiveStatus = async (req, res) => {
    var { activeStatus } = req.body
    var _id = req.locals._id
    if(!_id)
    {
        return res.status(400).send({
            success: false,
            msg: 'Incomplete info received'
        })
    }
    var updatedData = { activeStatus }
    var data = await DriverSchema.findOneAndUpdate({_id:_id}, updatedData, {new: true})
    .select(fields)
    .exec()
    if(!data)
    {
        return res.status(400).send({
            success: false,
            msg: 'Error updating active status'
        })
    }
    return res.status(200).send({
        success: true,
        data: data,
        msg: 'Successfully updated active status'
    })
}

exports.getActiveDriver = async (req, res) => {
    try
    {
        var drivers = await ActiveDriverSchema.find()
        .populate('driverId','name phone latitude longitude')
        if(!drivers)
        {
            res.status(200).send({
                success: false,
                error: true,
                msg: 'No drivers are active'
            })
        }
        else
        {
            res.status(200).send({
                success: true,
                msg: 'Successfully fetched active drivers',
                data: drivers
            })
        }
    }
    catch(error)
    {
        res.status(400).send({
            success: false,
            error: true,
            msg: 'Something went wrong'
        })
    }
}

exports.setDriverInactive = async (req, res) => {
    var _id = req.locals._id
    try
    {
        var deletedData = await ActiveDriverSchema.deleteOne({ driverId: _id })
        if(deletedData)
        {
            res.status(200).send({
                success: true,
                msg: 'Driver successfully set inactive',
                data: deletedData
            })
        }
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

exports.setDriverActive = async (req, res) => {
    var _id = req.locals._id
    try
    {
        var updatedData = {
            driverId: _id,
            active: true,
            createdAt: Date.now()
        }
        var data = await ActiveDriverSchema.findOneAndUpdate({driverId: _id}, updatedData, {
            upsert: true,
            new: true
        })
        if(data)
        {
            return res.status(200).send({
                success: true,
                data: data,
                msg: 'Driver successfully set active'
            })
        }
        else
        {
            return res.status(400).send({
                success: false,
                msg: 'Error updating active status'
            })
        }
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
        var data = await DriverSchema.findOne({_id:_id})
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
            msg: 'Driver location received',
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
