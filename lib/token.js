const jwt  = require('jsonwebtoken');
let secretkey = 'qwerfyAcquire';

module.exports.generateToken = (data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
        try{
            
            let claim = {
                userId: data.userId,
                emailId: data.emailId
            }
            let token = jwt.sign(claim, secretkey);
            resolve(token);
        }catch(err){
            reject(err);
        }
    });
}

module.exports.decodeToken = (token) => {
    return new Promise((resolve, reject) => {
        console.log(token, secretkey)
        jwt.verify(token, secretkey, (err, decoded)=>{
            if(err){
                reject(err);
            }else {
                resolve(decoded);
            }
        })
    })  
}








