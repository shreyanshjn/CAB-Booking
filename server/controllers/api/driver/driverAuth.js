var driverSchema = require('../../../models/driver/driver')
var driverToken = require('../../../models/driver/driver_token')
var activeDriver = require('../../../models/driver/activeDriver')
var { generateHash } = require('../../../helpers/HashPassword')
var { generateUserToken } = require('../../../helpers/TokenHelper')
var bcrypt = require('bcryptjs')
var fields = 'name email gender latitude longitude activeStatus rides phone' 

exports.registerDriver = async (req, res) =>  {
    const { name, email, gender, phone, password } = req.body
    if(!name || !email || !gender || !password || !phone)
    {
        res.status(400).send({
            error: true,
            msg: 'Incomplete data received'
        })
    }
    if(password.length <=6)
        res.status(400).send({
            error: true,
            msg: 'Password length must be more than 6 characters'
        })
    try
    {
        var hashedPass = await generateHash(password)
        if(hashedPass)
        {
            var data={ name, email, gender, password, phone }
            console.log(data)
            data.password=hashedPass
            var newUser = new driverSchema(data)
            var saveUser = await newUser.save();
            console.log(saveUser)
            if(saveUser._id)
            {
                res.status(200).send({
                    success: true,
                    msg  : 'Successfully registered'
                })
            }
            else
            {
                res.status(400).send({
                    error: true,
                    msg  : 'Error storing user'
                })
            }
        }
        else
        {
            res.status(400).send({
                error: true,
                msg  : 'Password hashing failed'
            })
        }
    }
    catch(err) {
        res.status(400).send({
            error: true,
            msg  : 'Email already exists'
        })
    }
}

exports.loginDriver =  async (req, res) => {
    const { email, password } = req.body
    if(!email || !password)
    {
        res.status(400).send({
            success: false,
            error: true,
            msg: 'Incomplete data received'
        })
    }
    try
    {
        var user = await driverSchema.findOne({ email: email })
        console.log(user)
        if(!user)
        {
            res.status(400).send({
                success: false,
                error: true,
                msg: 'Email id does not exists'
            })
        }
        else
        {
            var pass = await bcrypt.compare(password,user.password)
            console.log(pass)
            if(pass)
            {
                var deletePrevToken = await driverToken.deleteOne({_userId:user._id})
                console.log(deletePrevToken)
                if(!deletePrevToken)
                {
                    res.status(400).send({
                        success: true,
                        error: true,
                        msg: 'Error deleting token'
                    })
                }
                var token = generateUserToken(user._id, user.email)
                console.log(token)
                var _userId  = user._id
                var data = { _userId, token }
                var newToken = new driverToken(data)
                var saveToken = await newToken.save()
                console.log(saveToken,'token')
                if(saveToken)
                {
                    res.status(200).send({
                        success: true,
                        msg: 'Login Successful',
                        data: user,
                        token: token
                    })
                }
            }
            else
            {
                res.status(400).send({
                    success: false,
                    error: true,
                    msg: 'Invalid password'
                })
            }
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

exports.setActive= async (req, res) => {
    const { latitude, longitude, active } = req.body
    const _userId = req.locals._id
    console.log(req.body)
    if(!latitude || !longitude || !active || !_userId)
    {
        res.status(400).send({
            success: false,
            error: true,
            msg: 'Incomplete info received'
        })
    }
    else
    {
        try
        {
            var data = { latitude, longitude, active, _userId } 
            var findDriver = await activeDriver.findOne({_userId: _userId})
            console.log(findDriver,'findDriver')
            if(findDriver)
            {
                var createdAt = Date.now()
                var updatedData = {latitude, longitude, createdAt}
                var updateDriver = await activeDriver.updateOne({_userId: _userId},updatedData)
                if(updateDriver)
                {
                    res.status(200).send({
                        success: true,
                        msg: 'Driver location updated'
                    })
                }
                else
                {
                    res.status(400).send({
                        success: false,
                        error: true,
                        msg: 'Error updating location'
                    })
                }
            }
            else
            {
                var newUser = new activeDriver(data)
                var savedUser = await newUser.save()
                console.log(savedUser)
                if(!savedUser)
                {
                    res.status(400).send({
                        success: false,
                        error: true,
                        msg: 'Error saving user'
                    })
                }
                else
                {
                    res.status(200).send({
                        success: true,
                        msg: 'Successfully saved user'
                    })
                }
            }
        }
        catch
        {
            res.status(400).send({
                success: false,
                error: true,
                msg: 'Something went wrong'
            })
        }
    }
}

exports.isAuthenticated = async (req, res) => {
    if(req.locals._id)
    {
        try{
            var data = await driverSchema.findOne({ _id: req.locals._id})
            .select(fields)
            if(data)
            {
                return res.status(200).send({
                    success: true,
                    data: data,
                    msg: 'Successfully find user'
                })
            }
            else
            {
                return res.status(400).send({
                    success: false,
                    error: true,
                    msg: 'No user found'
                })
            }
        }
        catch
        {
            return res.status(400).send({
                success: false,
                error: true,
                msg: 'Something went wrong'
            })
        }
    }
}
