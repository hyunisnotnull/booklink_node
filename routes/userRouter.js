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

router.get('/getuser/:userId', (req, res) => {  
    console.log('/user/getuser');
    userService.getuser(req, res);
});

router.post('/modify', (req, res) => {  
    console.log('/user/modify');
    userService.modify(req, res);
});

router.get('/delete/:userId', (req, res) => {  
    console.log('/user/delete');
    userService.delete(req, res);
});

module.exports = router;