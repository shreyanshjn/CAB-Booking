var bcrypt = require('bcryptjs')

exports.generateHash = function(password) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(10, function(err, salt) {
            if(err) {
                return reject('Error generating salt')
            }
            bcrypt.hash(password, salt, function(err, hash) {
                if(err) {
                    return reject('Error generating hash')
                }
                return resolve(hash)
            })
        })
    })
}
