const express = require('express');
const router = express.Router();
const bookService = require('../lib/service/bookService');

// /book
router.get('/detail/:bookID', (req, res) => {  
    console.log('/book/detail/:bookID');
    bookService.detail(req, res);
});

// 도서 상세검색
router.get('/search_book', (req, res) => {  
    console.log('/book/search_book');
    bookService.search_book(req, res);
});

module.exports = router;