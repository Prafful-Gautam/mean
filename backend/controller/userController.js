const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

exports.userSignup = (req,res,next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
             .then(result => {
                 res.status(201).json({
                    message: 'User Created',
                    result: result
                 });
               
             })
             .catch(err => {
                 res.status(500).json({
                     error:err
                 });
             })  
        })

}

exports.userLogin = (req, res, next) => {
    let fetchuser;
   
    User.findOne({email:req.body.email}).then(user => {
        
        if(!user){
            return res.status(401).json({
                message: "Auth Failed"
            });
        }
        fetchuser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        
        if(!result){
            return res.status(401).json({
                message: 'Authentication Failed!'
            });
        }
        const token = jwt.sign(
            {email:fetchuser.email, userId:fetchuser._id},
            "secrete-key-should-longer",
            {expiresIn:'1h'}
        );
        console.log(token)
        return res.status(200).json({
            token:token,
            expireIn:3600,
            userId: fetchuser._id
        })
    })
    .catch(err => {
        console.log(err);
        return res.status(401).json({
            message: "Authentication Failed!"
        });
    });
}