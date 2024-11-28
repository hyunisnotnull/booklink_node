const axios = require('axios');
const { getYesterdaysDate } = require('../config/utils');

const homeService = {
    home: async (req, res) => {
        try {
            const libraryCode = req.query.libraryCode || '050001';  // 기본 도서관 코드 설정
            const searchDt = getYesterdaysDate();

            console.log('LIBRARY CODE:::', libraryCode);
            console.log('SEARCH DATE:::', searchDt);

            // 1. 인기 도서 API 호출
            let popularBooks = [];
            try {
                const popularBooksResponse = await axios.get(`${process.env.BOOK_API_URL}loanItemSrch?authKey=${process.env.BOOK_API_KEY}&pageNo=1&pageSize=15&format=json`);
                const popularBooksRaw = popularBooksResponse.data.response.docs;

                // isbn13이 있는 데이터만 필터링
                popularBooks = popularBooksRaw.filter(book => book.doc && book.doc.isbn13);
                console.log('POPULAR BOOKS:::', popularBooks);

                if (popularBooks.length === 0) {
                    console.log('인기도서 없음');
                }
            } catch (error) {
                console.error('Error fetching popular books:', error);
                popularBooks = null;  // 오류가 발생하면 null로 설정
            }

            // 2. 신착 도서 API 호출
            let newBooks = [];
            try {
                const newBooksResponse = await axios.get(`${process.env.BOOK_API_URL}newArrivalBook?authKey=${process.env.BOOK_API_KEY}&libCode=${libraryCode}&format=json`);
                const newBooksRaw = newBooksResponse.data.response.docs;

                newBooks = newBooksRaw.filter(book => book.doc && book.doc.isbn13);
                console.log('NEW BOOKS:::', newBooks);

                if (newBooks.length === 0) {
                    console.log('신착도서 없음');
                }
            } catch (error) {
                console.error('Error fetching new books:', error);
                newBooks = null;  // 오류가 발생하면 null로 설정
            }

            // 3. 급상승 도서 API 호출
            let risingBooks = [];
            try {
                const risingBooksResponse = await axios.get(`${process.env.BOOK_API_URL}hotTrend?authKey=${process.env.BOOK_API_KEY}&searchDt=${searchDt}&format=json`);
                const risingBooksRaw = risingBooksResponse.data.response.results;

                risingBooks = risingBooksRaw.length > 0 ? risingBooksRaw[0].result.docs || [] : [];
                console.log('RISING BOOKS:::', risingBooks);

                if (risingBooks.length === 0) {
                    console.log('급상승 도서 없음');
                }
            } catch (error) {
                console.error('Error fetching rising books:', error);
                risingBooks = null;  // 오류가 발생하면 null로 설정
            }

            // 최종적으로 응답 반환
            res.json({ popularBooks, newBooks, risingBooks });

        } catch (error) {
            console.error('Error in home service:', error);
            res.status(500).json({ error: 'Failed to fetch books', details: error.message });
        }
    },
};

module.exports = homeService;
