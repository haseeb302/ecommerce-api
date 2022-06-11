const e = require('express');
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const header = req.headers.token;
    if (token) {
        const token = header.split(' ')[1];
        jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
            if (err) {
                res.status(403).json("Invalid Token");
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        res.status(401).json("Authorization Failed");
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You don't have the permissions");
        }
    });
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You don't have the permissions");
        }
    });
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };