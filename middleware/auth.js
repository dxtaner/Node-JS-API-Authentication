const express = require('express');
const router = express.Router();
const User = require('../model/user.js');
const { registerValidation, loginValidation } = require('../validation');
const { valid } = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// register route
router.post('/register', async (req, res) => {
    // validate data control
    const error = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // daha once kullanilan mailler databasede var ise
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email zaten kayitli');

    // hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create new-user
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        city: req.body.city,
        email: req.body.email,
        password: hashPassword,
    });
    try {
        const save_user = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

// login route
router.post('/login', async (req, res) => {
    // validate data control
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // email control
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email kullanilmiyor..');

    // password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Password yanlış..');

    // create a -token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});


// update-user router
router.post('/updateUser', async (req, res) => {
    // validate data control
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // update -user
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        city: req.body.city,
        email: req.body.email,
        password: hashPassword,
        updated_date: Date.now()
    });
    try {
        const save_user = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
