const express = require('express');
const router = express.Router();
const userService = require('../lib/service/userService');

// user
router.get('/signin', (req, res) => {  
    console.log('/user/signin');
    userService.signin(req, res);
});

router.post('/signup', (req, res) => {  
    console.log('/user/signup');
    userService.signup(req, res);
});


module.exports = router;