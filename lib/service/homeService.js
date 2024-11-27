const axios = require('axios');
const {getYesterdaysDate} = require('../config/utils');

const homeService = {
    home: async (req, res) => {
        try {
            const libraryCode = req.query.libraryCode || '050001';  // 기본 도서관 코드 설정
            const searchDt = getYesterdaysDate();

            console.log('LIBRARY CODE:::', libraryCode);
            console.log('SEARCH DATE:::', searchDt);

            // 1. 인기 도서 API 호출
            const popularBooksResponse = await axios.get(`${process.env.BOOK_API_URL}loanItemSrch?authKey=${process.env.BOOK_API_KEY}&pageNo=1&pageSize=15&format=json`);
            const popularBooksRaw = popularBooksResponse.data.response.docs;

            // isbn13이 있는 데이터만 필터링
            const popularBooks = popularBooksRaw.filter(book => book.doc && book.doc.isbn13);

            console.log('POPULAR BOOKS:::', popularBooks);

            // 인기 도서 응답
            if (!popularBooks || popularBooks.length === 0) {
                return res.status(404).json({ message: '인기도서 없음' });
            }

            // 2. 신착 도서 API 호출
            const newBooksResponse = await axios.get(`${process.env.BOOK_API_URL}newArrivalBook?authKey=${process.env.BOOK_API_KEY}&libCode=${libraryCode}&format=json`);
            let newBooksRaw = newBooksResponse.data.response.docs;

            // isbn13이 있는 데이터만 필터링
            let newBooks = newBooksRaw.filter(book => book.doc && book.doc.isbn13);

            console.log('NEW BOOKS:::', newBooks);

            // 신착 도서 응답
            if (!newBooks || newBooks.length === 0) {
                return res.status(404).json({ message: '신착도서 없음' });
            }

            // newBooks = newBooks.slice(0, 8);

            // 3. 급상승 도서 API
            const risingBooksResponse = await axios.get(`${process.env.BOOK_API_URL}hotTrend?authKey=${process.env.BOOK_API_KEY}&searchDt=${searchDt}&format=json`);
            const risingBooksRaw = risingBooksResponse.data.response.results;

            console.log('risingBooksResponse:::', risingBooksResponse);
            console.log('risingBooksRaw:::', risingBooksRaw);

            const risingBooks = risingBooksRaw.flatMap(item => item.result.docs || []);
            
            console.log('risingBooks:::', risingBooks);
           
            if (!risingBooks || risingBooks.length === 0) {
                return res.status(404).json({ message: '급상승 도서 없음' });
            }

            res.json({ popularBooks, newBooks, risingBooks });

        } catch (error) {

            console.error('Error fetching books:', error);
            res.status(500).json({ error: 'Failed to fetch books', details: error.message });

        }
    },
};

module.exports = homeService;
