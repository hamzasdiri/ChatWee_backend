const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const ObjectId = require('mongoose').Types.ObjectId;


exports.readPost= async (req,res)=>{
    try{
        const post = await PostModel.findById(req.params.id);
        return res.status(201).json(post);
    }
    catch(err){
        return res.status(400).json({message:err});
    }
}

exports.createPost= async (req,res)=>{
    const newPost = new PostModel({
        posterId:req.body.posterId,
        message:req.body.message,
        video:req.body.video,
        likers:[],
        comments:[]
    });
    try{
    const post = await PostModel.create(newPost);
    //const post = await newPost.save();
    return res.status(201).json(post);
    }
    catch(err){
       return res.status(400).json({message:err});
    }
}

exports.updatePost= async (req,res)=>{
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown');
    const updatedRecord = {
        message:req.body.message
    }
    try{
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {$set:updatedRecord},
            {new:true,upsert:true}
        ).then((docs)=> {return res.send(docs)})
        .catch((err) => {return res.status(400).send(err)})
    }
    catch(err){
        return res.status(400).json({message:err})
    }
}

exports.deletePost= async (req,res)=>{
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown');
    
    try{
        await PostModel.findByIdAndRemove(req.params.id).exec();
        res.status(201).json({message:"Successfully deleted!"})
    }
    catch(err){
        return res.status(401).json({message:err});
    }
}

exports.likePost= async (req,res) =>{
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send('ID unknown');
    try{
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet:{likers:req.body.likerId}},
            {new:true,upsert:true}
        ).then((docs)=>{return res.send(docs)})
        .catch((err)=>{return res.status(400).send(err)})

        await UserModel.findByIdAndUpdate(
            req.body.likerId,
            {$addToSet:{likes:req.params.id}},
            {new:true,upsert:true}
        ).then((docs)=>{})
        .catch((err)=>{return res.status(400).send(err)})
    }
    catch(err){
        return res.status(400).json({message:err});
    }
}

exports.unlikePost= async (req,res) =>{
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send('ID unknown');
    try{
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {$pull:{likers:req.body.idOfUnliker}},
            {new:true,upsert:true}
        ).then((docs)=>{res.send(docs)})
         .catch((err) =>{return res.status(400).send(err)})
         
         await UserModel.findByIdAndUpdate(
            req.body.idOfUnliker,
            {$pull:{likes:req.params.id}},
            {new:true,upsert:true}
         ).then((docs)=>{})
          .catch((err)=>{ return res.status(400).send(err)})
    }
    catch(err){
        return res.status(400).json({message:err});
    }
}

// comments

exports.commentPost = async(req,res) =>{
if(!ObjectId.isValid(req.params.id)){
    return res.status(400).send('ID Unknown');
}

try{
    await PostModel.findByIdAndUpdate(
        req.params.id,
        {$push:{
            comments:{
                commenterId : req.body.commenterId,
                commenterPseudo : req.body.commenterPseudo,
                text:req.body.text,
                timestamp:new Date().getTime()
                }
            }},
        {new:true,upsert:true}
    ).then((docs)=>{return res.send(docs)})
    .catch((err)=>{ return res.status(400).send(err)})
}catch(err){
    return res.status(400).json({message:err});
}


}

exports.editCommentPost = async(req,res) =>{
    if(!ObjectId.isValid(req.params.id)){
        return res.status(400).send("ID Unknown");
    }

    try{
        await PostModel.findById(
            req.params.id,
            (err,docs)=>{  
                const _comment = docs.comments.find((comment)=>
                    comment._id.equals(req.body.commentId)
                );
                console.log("0");
                if(!_comment) {console.log("1");return res.status(404).send("Comment Not Found");}
                _comment.text = req.body.text;

                return docs.save((err)=>{
                    if(!err) {console.log("2");return res.status(200).send(docs);}
                    {console.log("3");return res.status(500).send({"err":err});}
                });
            }
        )
    }
    catch(err){
        console.log("4");
        return res.status(400).json({message:err});
    }
}

exports.deleteCommentPost = async(req,res)=>{
   if(!ObjectId.isValid(req.params.id)) return res.status(404).send('ID Unknown');

   try{
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull :{
                    comments :{
                        _id:req.body.commentId
                    }
                }
            },
            {new:true,upsert:true}
        ).then((docs)=>{return res.send(docs)})
        .catch((err)=>{ return res.status(400).send(err)})
   }catch(err){
    return res.status(400).json({message:err});
   }
}