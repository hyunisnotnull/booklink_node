const express = require('express');
const router = express.Router();
const userService = require('../lib/service/userService');

// user
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

router.post('/google', (req, res) => {  
    console.log('/user/google');
    userService.google(req, res);
});

// User Wish books
router.post('/addWishBook', (req, res) => {  
    console.log('/user/addWishBook');
    userService.addWishBook(req, res);
});

router.post('/wishBooks', (req, res) => {  
    console.log('/user/wishBooks');
    userService.wishBooks(req, res);
});

router.delete('/cancleWishBook', (req, res) => {  
    console.log('/user/cancleWishBook');
    userService.cancleWishBook(req, res);
});

router.put('/readWishBook', (req, res) => {  
    console.log('/user/readWishBook');
    userService.readWishBook(req, res);
});

// User Favorite Library
router.post('/addWishLib', (req, res) => {  
    console.log('/user/addWishLib');
    userService.addWishLib(req, res);
});

router.delete('/cancleWishLib', (req, res) => {  
    console.log('/user/cancleWishLib');
    userService.cancleWishLib(req, res);
});

router.post('/wishLibrarys', (req, res) => {  
    console.log('/user/wishLibrarys');
    userService.wishLibrarys(req, res);
});

module.exports = router;