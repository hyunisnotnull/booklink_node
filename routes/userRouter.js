const express = require('express');
const router = express.Router();
const userService = require('../lib/service/userService');
const logger = require('../lib/config/logger');

// user
router.post('/signup', (req, res) => {  
    logger.info('/user/signup');
    userService.signup(req, res);
});

router.get('/getuser/:userId', (req, res) => {  
    logger.info('/user/getuser');
    userService.getuser(req, res);
});

router.post('/modify', (req, res) => {  
    logger.info('/user/modify');
    userService.modify(req, res);
});

router.get('/delete/:userId', (req, res) => {  
    logger.info('/user/delete');
    userService.delete(req, res);
});

router.post('/google', (req, res) => {  
    logger.info('/user/google');
    userService.google(req, res);
});

// User Wish books
router.post('/addWishBook', (req, res) => {  
    logger.info('/user/addWishBook');
    userService.addWishBook(req, res);
});

router.post('/wishBooks', (req, res) => {  
    logger.info('/user/wishBooks');
    userService.wishBooks(req, res);
});

router.delete('/cancleWishBook', (req, res) => {  
    logger.info('/user/cancleWishBook');
    userService.cancleWishBook(req, res);
});

router.put('/readWishBook', (req, res) => {  
    logger.info('/user/readWishBook');
    userService.readWishBook(req, res);
});

// User Favorite Library
router.post('/addWishLib', (req, res) => {  
    logger.info('/user/addWishLib');
    userService.addWishLib(req, res);
});

router.delete('/cancleWishLib', (req, res) => {  
    logger.info('/user/cancleWishLib');
    userService.cancleWishLib(req, res);
});

router.post('/wishLibrarys', (req, res) => {  
    logger.info('/user/wishLibrarys');
    userService.wishLibrarys(req, res);
});

module.exports = router;