const express = require('express');
const router = express.Router();
const apiService = require('../lib/service/apiService');

// api
router.get('/region/:region', (req, res) => {  
    console.log('/api/library/region');
    apiService.region(req, res);
});

router.get('/name/:name', (req, res) => {  
    console.log('/api/library/name');
    apiService.name(req, res);
});

module.exports = router;