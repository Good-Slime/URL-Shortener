const express = require("express");
const url = require('../models/url');

const router =express.Router();

router.get('/', async (req, res) => {
    if (!req.user) return res.redirect('/signup');

    const allUrls = await url.find({ createdBy: req.user._id });
    return res.render('home', { urls: allUrls });
});

router.get('/signup', (req, res) => {
    if (req.user) return res.redirect('/');
    return res.render('signup');
});

router.get('/login', (req, res) => {
    if (req.user) return res.redirect('/');
    return res.render('/login');
});


module.exports=router;