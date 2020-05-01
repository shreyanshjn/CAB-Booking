var BookingSchema = require('../../../models/booking/booking')
var ConfirmedSchema = require('../../../models/booking/confirmedBooking')

exports.bookRide = async (req, res) =>
{
    const { riderId, driverId, driverLat, driverLong, riderLat, riderLong } = req.body
    const data = { riderId, driverId, driverLat, driverLong, riderLat, riderLong }
    if(riderId && driverId && driverLat && driverLong && riderLat && riderLong)
    {
        try
        {
            var newBooking = new BookingSchema(data)
            var savedBooking = await newBooking.save()
            if(!savedBooking)
            {
                return  res.status(400).send({
                    success: false,
                    error: true,
                    msg: 'Something went wrong'
                })
            }
            else
            {
                return res.status(200).send({
                    success: true,
                    msg: 'Succesfully saved booking',
                    data: data
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
    else
    {
        res.status(400).send({
            success: false,
            error: true,
            msg: 'All fields are required'
        })
    }
} 

exports.confirmRide = async (req, res) => {
    const _id = req.locals._id
    if(req.locals._id)
    {
        try
        {
            console.log(req.locals._id)
            var bookDetails = await BookingSchema.find({ driverId: _id })
                .populate('riderId' , 'name phone')
            if(!bookDetails)
            {
                res.status(400).send({
                    success: false,
                    error: true,
                    msg: 'No user found'
                })
            }
            else
            {
                res.status(200).send({
                    success: true,
                    msg: 'Ride found',
                    data: bookDetails
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
    else
    {
        res.status(400).send({
            success: false,
            error: true,
            msg: 'All fields are required'
        })
    }
}

exports.driverConfirmation = async (req, res) => {
    if(req && req.body._id)
    {
        var active = true
        var updatedData = { active }
        try
        {
            let confirmation = await BookingSchema.findOneAndUpdate({_id: req.body._id}, updatedData)
            if(!confirmation)
            {
                return res.status(400).send({
                    success: false,
                    msg: 'Error updating ride'
                })
            }
            else
            {
                const { riderId, driverId, driverLat, driverLong, riderLat, riderLong } = confirmation
                const data = { riderId, driverId, driverLat, driverLong, riderLat, riderLong }
                if(riderId && driverId && driverLat && driverLong && riderLat && riderLong)
                {
                    try
                    {
                        var newBooking = new ConfirmedSchema(data)
                        var savedBooking = await newBooking.save()
                        if(!savedBooking)
                        {
                            return  res.status(400).send({
                                success: false,
                                error: true,
                                msg: 'Something went wrong'
                            })
                        }
                        else
                        {
                            return res.status(200).send({
                                success: true,
                                msg: 'Ride accepted by driver',
                                data: data
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
    else
    {
        return res.status(400).send({
            success: false,
            msg: 'Incomplete info received'
        })
    }
}

exports.bookingDetails = async (req, res) => {
    if(req.locals._id && req.body && req.body.user)
    {
        var user = req.body.user
        var value = req.locals._is
        var query = {};
        query[user] = value;
        try 
        {
            var details = await ConfirmedSchema.findOne(query)
                .populate('driverId','name phone')
                .populate('riderId','name phone')
            if(!details)
            {
                return res.status(400).send({
                    success: false,
                    msg: 'Booking error'
                })
            }
            else
            {
                return res.status(200).send({
                    success: true,
                    msg: 'Successfully fetched details',
                    data: details
                })
            }
        }
        catch(error)
        {
            return res.status(400).send({
                success: true,
                msg: 'Error searching booking details',
                error: error
            })
        }
    }
}

exports.riderBookedStatus = async (req, res) => {
    if(req.locals._id)
    {
        try
        {
            var searchBooking = await BookingSchema.findOne({riderId: req.locals._id})
            if(!searchBooking)
            {
                return res.status(400).send({
                    success: true,
                    msg: 'Rider has not booked a ride',
                })
            }
            else
            {
                if(searchBooking.active)
                {
                    return res.status(200).send({
                        success: true,
                        msg: 'Booking is confirmed',
                        data: searchBooking
                    })
                }
                else
                {
                    return res.status(400).send({
                        success: true,
                        msg: 'Booking is not confirmed yet by driver',
                    })
                }
            }
        }
        catch(error)
        {
            return res.status(400).send({
                success: true,
                msg: 'Something went wrong',
                error: error
            })
        }
    }
}
