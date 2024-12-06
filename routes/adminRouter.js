const express = require('express');
const router = express.Router()
const adminService = require('../lib/service/adminService');
const logger = require('../lib/config/logger');

// admin
router.get('/signin', (req, res) => {  
    logger.info('/admin/signin');
    adminService.signin(req, res);
});

router.post('/signup', (req, res) => {  
    logger.info('/admin/signup');
    adminService.signup(req, res);
});


router.get('/getadmin/:adminId', (req, res) => {  
    logger.info('/admin/getadmin');
    adminService.getadmin(req, res);
});

router.post('/modify', (req, res) => {  
    logger.info('/admin/modify');
    adminService.modify(req, res);
});

router.get('/delete/:adminId', (req, res) => {  
    logger.info('/admin/delete');
    adminService.delete(req, res);
});

router.post('/getid', (req, res) => {  
    logger.info('/admin/getid');
    adminService.getid(req, res);
});


module.exports = router;