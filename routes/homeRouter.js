const express = require('express');
const router = express.Router();
const homeService = require('../lib/service/homeService');

// home
router.get('/', (req, res) => {  
    console.log('/home');
    homeService.home(req, res);
});

module.exports = router;