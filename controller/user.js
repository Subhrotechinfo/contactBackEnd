const mongoose = require('mongoose');
const {Email, Password} = require('../lib/inputValidator');
const {isEmpty} = require('../lib/check');
const model = require('../model/userModel') 
const UserModel  = mongoose.model('user');
const {hashPassword, comparePassword}  = require('../lib/bcrypt');
const shortId = require('shortid');
const {generateToken, decodeToken} = require('../lib/token')

module.exports.signup = (req, res) =>{
        //validate the user input
        let userInputValidator = () =>{
            console.log('Email-->', req.body.password)
            return new Promise((resolve, reject)=>{
                if(req.body.emailId){
                    if(!Email(req.body.emailId)){
                        // response.status(200);
                        console.log('1')
                        reject('Email does not met the requirement')
                    }else if(isEmpty(req.body.password)){
                        console.log('2')
                        reject('password parameter is missing');
                    }else if(!Password(req.body.password)) {
                        console.log('3')
                        reject('password must be min 8 character')
                    } 
                    else{
                        console.log('resolve')
                        resolve(req);
                    }
                } else {
                    console.log('Field missing', 'userController(): createUser');
                    reject('One or more paratemer(s) is missing');
                }
            });
        } //end validateUserInput

        let userCreate  = () => {
            console.log('here-->', req.body.emailId)
            return new Promise((resolve,reject)=>{
                UserModel.findOne({emailId: req.body.emailId})
                    .exec()
                    .then((retrievedUserDetails)=>{
                        if(isEmpty(retrievedUserDetails)){
                            let newUser = new UserModel({
                                userId: shortId.generate(),
                                name: req.body.name,
                                emailId: req.body.emailId,
                                password: hashPassword(req.body.password)
                            })
                            newUser.save()
                                .then((newUser)=> {
                                    console.log('saved user', newUser.emailId);
                                    if(!isEmpty(newUser)){
                                        // delete newUser.password;
                                        resolve(newUser)
                                    } else {
                                        reject('Something went wrong while saving the data.');
                                        
                                    }
                                })
                                .catch((err) => {
                                    reject(err)
                                });
                        }else {
                            console.log('User cannot be created. User is already present', 'UserController: createUser');
                            reject('User already present with this email id.')
                        }
                    })
            });
        }
    
        
        userInputValidator(req,res)
        .then(userCreate)
        .then((data) => {
            res.status(200).json({success: true, msg: 'User created Successs'});
        })
        .catch((err) => {
            res.status(200).send(err);
        })
}


module.exports.login = (req, res) => {
    let findUser = () => {
        return new Promise((resolve,reject)=>{
            if(req.body.emailId) {
                if(Email(req.body.emailId)){
                    UserModel.findOne({emailId: req.body.emailId})
                        .exec()
                        .then((userDetails)=>{
                            if(isEmpty(userDetails)){
                                reject('User details not found')
                            }else {
                                resolve(userDetails)
                            }
                        })
                        .catch((err)=>{
                            reject(err,'something went wrong while fetching the details');
                        });
                }else {
                    reject({err:'invalid emailid format'});
                }
                
            }else {
                reject('email parameter is missing');
            }
        });
    } //find user end
    let passwordValidator = (retrievedUserDetail) => {
        return new Promise((resolve,reject)=>{
            if(req.body.password){
                comparePassword(req.body.password, retrievedUserDetail.password)
                .then((isMatch) => {
                    if(isMatch){
                        resolve(retrievedUserDetail);
                    }else {
                        reject('wrong password');
                    }
                })
                .catch((err) => {
                    reject(err)
                });
            }else {
                reject({err:'password field is missing'});
            }
            
        });
    }//password validator end
    let tokenGenerate = (retrievedUser) => {
        return new Promise((resolve, reject)=>{
            generateToken(retrievedUser)
            .then((tokenDetail)=>{
                retrievedUser.token = tokenDetail; 
                resolve(retrievedUser);
            })
            .catch((err)=>{
                reject(err);
            })
        })
        
    }

    findUser(req,res)
        .then(passwordValidator)
        .then(tokenGenerate)
        .then((loggedinUser) => {
            res.status(200).json({success: true, 
            data: {
                token: loggedinUser.token, 
                userId:loggedinUser.userId, 
                emailId: loggedinUser.emailId }});
        })
        .catch((err) => {
            res.status(200).json({err:err});
        });
}

module.exports.userDetail = (req, res) => {
    let decode = () => {
        return new Promise((resolve, reject) => {
            // console.log(req.headers.authorizations);
            decodeToken(req.headers.authorizations)
                .then((decoded)=>{
                    console.log(decoded);
                    // delete decoded.iat;
                    resolve(decoded);
                })
                .catch((err)=>{
                    reject(err)
                })
        })
    }

    let findUser = (userDetails) => {
        return new Promise((resolve, reject)=>{
            UserModel.findOne({emailId: userDetails.emailId})
                .exec()
                .then((userfound)=>{
                    if(!isEmpty(userfound)){
                        resolve(userfound);
                    }else{
                        reject('no user exist or invalid token');
                    }
                })
                .catch((err)=>{
                    reject(err);
                })
        })
    } 

    decode(req, res)
        .then(findUser)
        .then((data)=>{
            res.status(200).json({success: true, 
                data:{
                    userId: data.userId, 
                    name:data.name, 
                    emailId: data.emailId
                    }
                });
        })  
        .catch((err)=>{
            console.error(err)
            res.status(200).json({err:err, error: true});
        })  
}

module.exports.updateUserProfile = (req, res) => {
    //decode token
    let decode = () => {
        return new Promise((resolve, reject) => {
            decodeToken(req.headers.authorizations)
                .then((decoded)=>{
                    // delete decoded.iat;
                    resolve(decoded);
                })
                .catch((err)=>{
                    reject(err)
                })
        })
    } //end edecode

    let findUserandUpdate = (userDetails) => {
        let saveUserDetail = {};
        if(req.body.name){
            saveUserDetail =  {
                'name': req.body.name
            };
        }else if(req.body.password){
            saveUserDetail =  {
                'password': hashPassword(req.body.password)
            };

        }else if(req.body.name && req.body.name){
            saveUserDetail =  {
                'name': req.body.name,
                'password': hashPassword(req.body.password)
            };
        }
        
        return new Promise((resolve, reject)=>{
            UserModel.findOneAndUpdate({emailId: userDetails.emailId},saveUserDetail)
                .exec()
                .then((userUpdated)=>{
                    if(!isEmpty(userUpdated)){
                        resolve(userUpdated);
                    }else{
                        reject('not updated');
                    }
                })
                .catch((err)=>{
                    reject('error not found');
                })
        });
    }
    decode(req, res)
        .then(findUserandUpdate)
        .then((updated)=>{
            res.status(200).json({success: true, msg: 'user details updated',
            data:{name: updated.name}});
        })
        .catch((err)=>{
            res.status(200).json({err:err});
        })

}



