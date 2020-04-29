var driverToken = require('../../../models/driver/driver_token')
var { generateHash } = require('../../../helpers/HashPassword')
var { generateUserToken } = require('../../../helpers/TokenHelper')
var bcrypt = require('bcryptjs')

exports.register = async (data, schema) =>  {
    var {password } = data
    try
    {
        var hashedPass = await generateHash(password)
        if(hashedPass)
        {
            data.password=hashedPass
            var newUser = new schema(data)
            var saveUser = await newUser.save();
            console.log(saveUser)
            if(saveUser._id)
            {
                return 'registered'  
            }
            else
            {
                console.log('e')
                return 'error storing user'
            }
        }
        else
        {
                console.log('f')
            return 'Hashing failed'
        }
    }
    catch(err) {
                console.log('g')
        return 'email exists'
    }
}

exports.loginDriver =  async (req, res) => {
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
        var user = await driverSchema.findOne({ email: email })
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
                var deletePrevToken = await driverToken.deleteOne({_userId:user._id})
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
                var newToken = new driverToken(data)
                var saveToken = newToken.save()
                console.log(saveToken,'token')
                if(saveToken)
                {
                    res.status(200).send({
                        success: true,
                        msg: 'Login Successful'
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
