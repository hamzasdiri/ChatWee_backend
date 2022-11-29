const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const maxAge = 3*24*60*60*1000;
const createToken =(id)=>{
    return jwt.sign({id},process.env.TOKEN_SECRET,{
        expiresIn:maxAge //3 jours le token est valide
    })
}

exports.signup = async(req,res)=>{

    try{
        const salt =await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(req.body.password,salt);
        const user = await UserModel.create({username:req.body.username,email:req.body.email,password:hashedPassword});//we can use user.save();
        res.status(200).json(user);
    }
    catch(err){
        res.status(400).send({"message":err});
    }

}


exports.login = async(req,res)=>{
    try{
        const user = await UserModel.findOne({email:req.body.email});
        !user && res.status(404).json("User Not Found!");
        if(user){
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json("Wrong Password");
        
        if(validPassword){
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge});
        res.status(200).json({user:user._id});
            }
        }
    }
    catch(err){
        res.status(400).send({"message":err});

    }
}

exports.logout = (req,res)=>{
    res.cookie('jwt','',{maxAge:1}); //1 milliseconde
    res.redirect('/');
}