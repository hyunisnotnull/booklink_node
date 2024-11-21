const express = require('express');
const router = express.Router();
const bookService = require('../lib/service/bookService');

// /book
router.get('/detail/:bookID', (req, res) => {  
    console.log('/book/detail/:bookID');
    bookService.detail(req, res);
});

module.exports = router;