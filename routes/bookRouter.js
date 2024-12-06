const express = require('express');
const router = express.Router();
const bookService = require('../lib/service/bookService');
const logger = require('../lib/config/logger');

// 도서 상세정보
router.get('/detail/:bookID', (req, res) => {  
    logger.info('/book/detail/:bookID');
    bookService.detail(req, res);
});

// 관련 도서 정보
router.get('/relatedBook/:bookID', (req, res) => {  
    logger.info('/book/relatedBook/:bookID');
    bookService.relatedBook(req, res);
});

// 도서 상세검색
router.get('/search_book', (req, res) => {  
    logger.info('/book/search_book');
    bookService.search_book(req, res);
});

// 도서로 도서관 검색
router.get('/search_library', (req, res) => {  
    logger.info('/book/search_library');
    bookService.search_library(req, res);
});

// 인기 도서 API
router.get('/popularBooks', (req, res) => {  
    logger.info('/book/popularBooks');
    bookService.getPopularBooks(req, res);
});

// 신착 도서 API
router.get('/newBooks', (req, res) => {  
    logger.info('/book/newBooks');
    bookService.getNewBooks(req, res);
});

// 급상승 도서 API
router.get('/risingBooks', (req, res) => {  
    logger.info('/book/risingBooks');
    bookService.getRisingBooks(req, res);
});

module.exports = router;