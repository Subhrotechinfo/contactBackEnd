const bcrypt = require('bcrypt');
let saltRounds = 10;

module.exports.hashPassword = (password) => {
    return bcrypt.hashSync(password , bcrypt.genSaltSync(saltRounds));
}

module.exports.comparePassword  = (oldPassword , hashPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(oldPassword, hashPassword, (err, result)=>{
            if(err){
                console.log(err.message, 'Comparison Error', 5);
                reject(err);
            }else {
                resolve(result);
            }
        })
    })
}




