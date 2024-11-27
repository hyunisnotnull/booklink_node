const express = require('express');
const router = express.Router();
const bookService = require('../lib/service/bookService');

// 책 상세검색
router.get('/detail/:bookID', (req, res) => {  
    console.log('/book/detail/:bookID');
    bookService.detail(req, res);
});

// 도서 상세검색
router.get('/search_book', (req, res) => {  
    console.log('/book/search_book');
    bookService.search_book(req, res);
});

router.get('/search_library', (req, res) => {  
    console.log('/book/search_library');
    bookService.search_library(req, res);
});

module.exports = router;