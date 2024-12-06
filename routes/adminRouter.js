const express = require('express');
const router = express.Router()
const adminService = require('../lib/service/adminService');

// admin
router.get('/signin', (req, res) => {  
    console.log('/admin/signin');
    adminService.signin(req, res);
});

router.post('/signup', (req, res) => {  
    console.log('/admin/signup');
    adminService.signup(req, res);
});


router.get('/getadmin/:adminId', (req, res) => {  
    console.log('/admin/getadmin');
    adminService.getadmin(req, res);
});

router.post('/modify', (req, res) => {  
    console.log('/admin/modify');
    adminService.modify(req, res);
});

router.get('/delete/:adminId', (req, res) => {  
    console.log('/admin/delete');
    adminService.delete(req, res);
});

router.post('/getid', (req, res) => {  
    console.log('/admin/getid');
    adminService.getid(req, res);
});


module.exports = router;