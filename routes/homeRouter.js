const express = require('express');
const router = express.Router();
const homeService = require('../lib/service/homeService');
const logger = require('../lib/config/logger');

// home
// router.get('/', (req, res) => {  
//     logger.info('/home');
//     homeService.home(req, res);
// });

module.exports = router;