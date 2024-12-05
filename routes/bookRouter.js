const express = require('express');
const router = express.Router();
const bookService = require('../lib/service/bookService');

// 도서 상세정보
router.get('/detail/:bookID', (req, res) => {  
    console.log('/book/detail/:bookID');
    bookService.detail(req, res);
});

// 관련 도서 정보
router.get('/relatedBook/:bookID', (req, res) => {  
    console.log('/book/relatedBook/:bookID');
    bookService.relatedBook(req, res);
});

// 도서 상세검색
router.get('/search_book', (req, res) => {  
    console.log('/book/search_book');
    bookService.search_book(req, res);
});

// 도서로 도서관 검색
router.get('/search_library', (req, res) => {  
    console.log('/book/search_library');
    bookService.search_library(req, res);
});

// 도서관 상세 정보
router.get('/library_detail/:libCode', (req, res) => {  
    console.log('/book/library_detail/:libCode');
    bookService.library_detail(req, res);
});

module.exports = router;