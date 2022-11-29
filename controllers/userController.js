const { isObjectIdOrHexString } = require('mongoose');
const User = require('../models/User');
const UserModel = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;


exports.getAllUsers =async (req,res)=>{
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

exports.getUser = async(req,res)=>{
    if(!ObjectId.isValid(req.params.id)) //objectId verifie si l id entré est valide comme un id ou non
    return res.status(400).send('ID unknown:' + req.params.id);
    
    UserModel.findById(req.params.id,(err,docs)=>{
        if(!err) res.status(200).send(docs);
        else console.log('ID unknownn :' + err);
    }).select('-password');
    
}

exports.updateUser = async(req,res)=>{
    if(!ObjectId.isValid(req.params.id)) 
    return res.status(400).send('ID unknown');

    try{
        await UserModel.findOneAndUpdate(
            {_id:req.params.id},
            {
                $set:{
                    desc:req.body.desc
                }
            },
            {new:true,upsert:true,setDefaultsOnInsert:true},
            
        ).then((docs) => {return res.send(docs)})
        .catch((err) => {return res.status(500).send({message: err})})
    }
    catch(err){
        res.status(400).json({message:err});
    }
}



exports.deleteUser = async(req,res)=>{
    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('ID unknown');

    try{
        await UserModel.remove({_id:req.params.id}).exec();
        res.status(200).json({message:"Successfully deleted"});
    }
    catch(err){
        res.status(400).json({message:err})
    }
}