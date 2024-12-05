const axios = require('axios');
const { getYesterdaysDate, getLastMonth, getFirstDayOfYear } = require('../config/utils');

const homeService = {
    // 인기 도서 가져오기
    getPopularBooks: async (req, res) => {
        try {
            const startDt = getFirstDayOfYear();
            const popularBooksResponse = await axios.get(`${process.env.BOOK_API_URL}loanItemSrch?authKey=${process.env.BOOK_API_KEY}&startDt=${startDt}&pageNo=1&pageSize=15&format=json`);
            const popularBooksRaw = popularBooksResponse.data.response.docs;
            const popularBooks = popularBooksRaw.filter(book => book.doc && book.doc.isbn13);
            // console.log('pop::', popularBooks);
            res.json({ popularBooks });
        } catch (error) {
            console.error('Error fetching popular books:', error);
            res.status(500).json({ error: 'Failed to fetch popular books' });
        }
    },

    // 신착 도서 가져오기
    getNewBooks: async (req, res) => {
        try {
            const libraryCode = req.query.libraryCode || '050001';

            console.log('libraryCode:::', libraryCode);

            const lastMonth = getLastMonth();
            const newBooksResponse = await axios.get(`${process.env.BOOK_API_URL}newArrivalBook?authKey=${process.env.BOOK_API_KEY}&libCode=${libraryCode}&searchDt=${lastMonth}&format=json`);
            const newBooksRaw = newBooksResponse.data.response?.docs || [];
            const newBooks = newBooksRaw.filter(book => book.doc && book.doc.isbn13);
            console.log('new::', newBooks);
            res.json({ newBooks });
        } catch (error) {
            console.error('Error fetching new books:', error);
            res.status(500).json({ error: 'Failed to fetch new books' });
        }
    },

    // 급상승 도서 가져오기
    getRisingBooks: async (req, res) => {
        try {
            const searchDt = getYesterdaysDate();
            const risingBooksResponse = await axios.get(`${process.env.BOOK_API_URL}hotTrend?authKey=${process.env.BOOK_API_KEY}&searchDt=${searchDt}&format=json`);
            const risingBooksRaw = risingBooksResponse.data.response.results;
            const risingBooks = risingBooksRaw.length > 0 ? risingBooksRaw[0].result.docs || [] : [];
            // console.log('hot::', risingBooks);
            res.json({ risingBooks });
        } catch (error) {
            console.error('Error fetching rising books:', error);
            res.status(500).json({ error: 'Failed to fetch rising books' });
        }
    },
    
};

module.exports = homeService;
