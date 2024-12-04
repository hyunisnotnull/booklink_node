const express = require('express');
const router = express.Router();
const homeService = require('../lib/service/homeService');

// home
// router.get('/', (req, res) => {  
//     console.log('/home');
//     homeService.home(req, res);
// });

// 인기 도서 API
router.get('/popularBooks', (req, res) => {  
    console.log('/home/popularBooks');
    homeService.getPopularBooks(req, res);
});

// 신착 도서 API
router.get('/newBooks', (req, res) => {  
    console.log('/home/newBooks');
    homeService.getNewBooks(req, res);
});

// 급상승 도서 API
router.get('/risingBooks', (req, res) => {  
    console.log('/home/risingBooks');
    homeService.getRisingBooks(req, res);
});

module.exports = router;