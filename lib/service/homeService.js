const axios = require('axios');
const { getYesterdaysDate, getLastMonth } = require('../config/utils');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const homeService = {
    home: async (req, res) => {
        try {
            const libraryCode = req.query.libraryCode || '050001';  // 기본 도서관 코드 설정
            const searchDt = getYesterdaysDate();
            const lastMonth = getLastMonth();

            console.log('LIBRARY CODE:::', libraryCode);
            console.log('SEARCH DATE:::', searchDt);
            console.log('lastMonth:::', lastMonth);

            // 1. 인기 도서 API 호출
            let popularBooks = [];
            try {
                const startTime = Date.now();
                console.log('1 ----> start', startTime);
                const popularBooksResponse = await axios.get(`${process.env.BOOK_API_URL}loanItemSrch?authKey=${process.env.BOOK_API_KEY}&pageNo=1&pageSize=15&format=json`);
                const endTime = Date.now();
                console.log('1 ----> end', endTime);
                const popularBooksRaw = popularBooksResponse.data.response.docs;

                // isbn13이 있는 데이터만 필터링
                popularBooks = popularBooksRaw.filter(book => book.doc && book.doc.isbn13);

                if (popularBooks.length === 0) {
                    console.log('인기도서 없음');
                }
            } catch (error) {
                console.error('Error fetching popular books:', error);
                popularBooks = null;  // 오류가 발생하면 null로 설정
            }

            // 1번 요청 후 대기
            // await delay(300);  // 1000 = 1초

            for(let i= 0; i < 3; i++){
                console.log('');
            }

            // 2. 신착 도서 API 호출
            let newBooks = [];
            try {
                const startTime = Date.now();
                console.log('2 ----> start', startTime);
                const newBooksResponse = await axios.get(`${process.env.BOOK_API_URL}newArrivalBook?authKey=${process.env.BOOK_API_KEY}&libCode=${libraryCode}&searchDt=${lastMonth}&format=json`);
                const endTime = Date.now();
                console.log('2 ----> end', endTime);
                const newBooksRaw = newBooksResponse.data.response.docs;

                newBooks = newBooksRaw.filter(book => book.doc && book.doc.isbn13);

                if (newBooks.length === 0) {
                    console.log('신착도서 없음');
                }
                const timeD = endTime - startTime; 
                console.log(`2번 시간차: ${timeD} ms`);
            } catch (error) {
                console.error('Error fetching new books:', error);
                newBooks = null;  // 오류가 발생하면 null로 설정
            }

            // 2번 요청 후 대기
            await delay(300);  // 1000 = 1초

            // 3. 급상승 도서 API 호출
            let risingBooks = [];
            try {
                const startTime = Date.now();
                console.log('3 ----> start', startTime);
                const risingBooksResponse = await axios.get(`${process.env.BOOK_API_URL}hotTrend?authKey=${process.env.BOOK_API_KEY}&searchDt=${searchDt}&format=json`);
                const endTime = Date.now();
                console.log('3 ----> end', endTime);
                const risingBooksRaw = risingBooksResponse.data.response.results;

                risingBooks = risingBooksRaw.length > 0 ? risingBooksRaw[0].result.docs || [] : [];

                if (risingBooks.length === 0) {
                    console.log('급상승 도서 없음');
                }
                const timeD = endTime - startTime;
                console.log(`3번 시간차: ${timeD} ms`);
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

    // getPopularBooks: async (req, res) => {
    //     try {
    //         const popularBooksResponse = await axios.get(`${process.env.BOOK_API_URL}loanItemSrch?authKey=${process.env.BOOK_API_KEY}&pageNo=1&pageSize=15&format=json`);
    //         const popularBooksRaw = popularBooksResponse.data.response.docs;
    //         const popularBooks = popularBooksRaw.filter(book => book.doc && book.doc.isbn13);
    //         console.log('pop::', popularBooks);
    //         res.json({ popularBooks });
    //     } catch (error) {
    //         console.error('Error fetching popular books:', error);
    //         res.status(500).json({ error: 'Failed to fetch popular books' });
    //     }
    // },

    // // 신착 도서 가져오기
    // getNewBooks: async (req, res) => {
    //     try {
    //         const libraryCode = req.query.libraryCode || '050001';
    //         const lastMonth = getLastMonth();
    //         const newBooksResponse = await axios.get(`${process.env.BOOK_API_URL}newArrivalBook?authKey=${process.env.BOOK_API_KEY}&libCode=${libraryCode}&searchDt=${lastMonth}&format=json`);
    //         const newBooksRaw = newBooksResponse.data.response.docs;
    //         const newBooks = newBooksRaw.filter(book => book.doc && book.doc.isbn13);
    //         console.log('new::', newBooks);
    //         res.json({ newBooks });
    //     } catch (error) {
    //         console.error('Error fetching new books:', error);
    //         res.status(500).json({ error: 'Failed to fetch new books' });
    //     }
    // },

    // // 급상승 도서 가져오기
    // getRisingBooks: async (req, res) => {
    //     try {
    //         const searchDt = getYesterdaysDate();
    //         const risingBooksResponse = await axios.get(`${process.env.BOOK_API_URL}hotTrend?authKey=${process.env.BOOK_API_KEY}&searchDt=${searchDt}&format=json`);
    //         const risingBooksRaw = risingBooksResponse.data.response.results;
    //         const risingBooks = risingBooksRaw.length > 0 ? risingBooksRaw[0].result.docs || [] : [];
    //         console.log('hot::', risingBooks);
    //         res.json({ risingBooks });
    //     } catch (error) {
    //         console.error('Error fetching rising books:', error);
    //         res.status(500).json({ error: 'Failed to fetch rising books' });
    //     }
    // },
    
};

module.exports = homeService;
