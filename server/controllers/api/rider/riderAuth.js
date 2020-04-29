var riderSchema= require('../../../models/rider/rider')
var riderToken = require('../../../models/rider/rider_token')
var { generateHash } = require('../../../helpers/HashPassword')
var { generateUserToken } = require('../../../helpers/TokenHelper')
var bcrypt = require('bcryptjs')

exports.registerRider= async (req, res) =>  {
    const { name, email, gender, password, phone } = req.body
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
            data.password=hashedPass
            var newUser = new riderSchema(data)
            var saveUser = await newUser.save();
            console.log(saveUser)
            if(saveUser._id)
            {
                res.status(200).send({
                    msg  : 'Successfully registered',
                    success: true
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

exports.loginRider=  async (req, res) => {
    const { email, password } = req.body
    if(!email || !password)
    {
        res.status(400).send({
            error: true,
            msg: 'Incomplete data received'
        })
    }
    try
    {
        var user = await riderSchema.findOne({ email: email })
        console.log(user)
        if(!user)
        {
            res.status(400).send({
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
                var deletePrevToken = await riderToken.deleteOne({_userId:user._id})
                console.log(deletePrevToken)
                if(!deletePrevToken)
                {
                    res.status(400).send({
                        error: true,
                        msg: 'Error deleting token'
                    })
                }
                var token = generateUserToken(user._id, user.email)
                console.log(token)
                var _userId  = user._id
                var data = { _userId, token }
                var newToken = new riderToken(data)
                var saveToken = await newToken.save()
                console.log(saveToken,'token')
                if(saveToken)
                {
                    res.status(200).send({
                        success: true,
                        msg: 'Login Successful',
                        data: saveToken
                    })
                }
            }
            else
            {
                res.status(400).send({
                    error: true,
                    msg: 'Invalid password'
                })
            }
        }
    }
    catch(error)
    {
        res.status(400).send({
            error: true,
            msg: 'Something went wrong'
        })
    }
}
