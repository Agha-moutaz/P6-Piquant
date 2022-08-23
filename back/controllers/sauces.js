const express = require('express');
const Sauce = require('../models/Sauce');
const fs = require('fs');
const router = express.Router();

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    console.log(req .file)
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'choix enregistré !'}))
        .catch(error => res.status(400).json({error}));
};
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(Sauce => res.status(201).json(Sauce))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(Sauces => res.status(201).json(Sauces))
        .catch(error =>{
            console.log(error);
            res.status(400).json({error});
        });  
};  
exports.modifySauce = async(req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
        ...req.body
    };

    delete sauceObject._userId;

    try {
        const sauce = await Sauce.findOne({
            _id: req.params.id
        })

        if (!sauce) {
            return res.status(404).json ({message: 'not found'})
        }

        if (sauce.userId != req.auth.userId) {
            res.status(403).json({
                message: 'Non-autorisé'
            });
        } else {
            await Sauce.updateOne({
                _id: req.params.id
            }, sauceObject)

            res.status(200).json({message: 'sauce modifié!'})
        }
    }
    catch(error) {
        console.log (error)
        res.status(400).json({error})
    }
};

exports.deleteSauce = (req, res, next) => {
    const sauce = new Sauce()
    Sauce.findOne({ _id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId){
                res.status(403).json({ message: 'Non autorisé'});
            }else{
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`,()=> {
                    sauce.deleteOne({_id: req.params.id})
                        .then(() => {res.status(200).json({message:'sauce suprimé !'})})
                        .catch(error => res.status(401).json({ error}));
                });
            }
        })
        .catch(error => {res.status(500).json({ error})});
};

            

exports.likeSauce = async (req, res, next) => {
    try{
       
        const oneSauce = await Sauce.findOne({ _id: req.params.id})
        
        if (!oneSauce.usersLiked.includes(req.body.userId) && req.body.like === 1){
            await Sauce.updateOne(
                {_id :req.params.id}, 
                {
                    $inc: {likes: 1},
                    $push: {usersLiked: req.body.userId}
                }
            )
        
            return res.status(201).json({message: 'sauce liked +1'})
            
        }
        if(oneSauce.usersLiked.includes(req.body.userId) && req.body.like === 0){
            await Sauce.updateOne(
                {_id :req.params.id}, 
                {
                    $inc: {likes: -1},
                    $pull: {usersLiked: req.body.userId},
                }
            )
            return res.status(201).json({message: 'sauce liked 0'})
            
        }
                
        if (!oneSauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){
            await Sauce.updateOne(
                {_id :req.params.id}, 
                {
                    $inc: {dislikes: 1},
                    $push: {usersDisliked: req.body.userId},
                }
            )
            return res.status(201).json({message: 'sauce disliked +1'})
            
        }
        if(oneSauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
            await Sauce.updateOne(
                {_id :req.params.id}, 
                {
                    $inc: {dislikes: -1},
                    $pull: {usersDisliked: req.body.userId}
                }
            )
            return res.status(201).json({message: 'sauce disliked 0'})
            
        }
        throw "unknown action"
    } 
    catch(error) {
        console.log(error);
        res.status(500).json({ error})
    }
};