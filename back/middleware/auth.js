const express = require('express');
const jwt = require('jsonwebtoken');



module.exports = (req, res, next) => {
try{
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
        throw 'User ID non valable !'
    } else {
        req.auth = decodedToken;
        next()
    }
} catch(error) {
    res.status(401).json({ error });
}
};