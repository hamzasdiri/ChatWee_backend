const UserModel = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const User = require('../models/User');


exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

exports.getUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) //objectId verifie si l id entré est valide comme un id ou non
        return res.status(400).send('ID unknown:' + req.params.id);

    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.status(200).send(docs);
        else console.log('ID unknownn :' + err);
    }).select('-password');

}

exports.updateUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown');

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    try {
        await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: req.body,

            },
            { new: true, upsert: true, setDefaultsOnInsert: true },

        ).then((docs) => { return res.send(docs) })
            .catch((err) => { return res.status(500).send({ message: err }) })


    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}



exports.deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown');

    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Successfully deleted" });
    }
    catch (err) {
        res.status(400).json({ message: err })
    }
}


exports.followUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToFollow))
        return res.status(400).send('ID unknown');

    try {
        // add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } }, //add to what we have
            { new: true, upsert: true },
        ).then((docs) => { return res.send(docs) })
            .catch((err) => { return res.status(500).send({ message: err }) })
        // add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true }
        ).then((docs) => { })
            .catch((err) => { return res.status(500).send({ message: err }) })
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
}

exports.unfollowUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID unknown');

    try {
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true }
        ).then((docs) => {  res.status(201).send(docs) })
            .catch((err) => { return res.status(500).send({ message: err }) })

        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true }
        ),
        (err,docs)=>{
            if(err) return res.status(400).json({message:err})
        }
    }
    catch (err) {
        res.status(400).json({ message: err });
    }

}