const axios = require('axios');

const bookService = {
    detail: async (req, res) => {
        try {
            const { bookID } = req.params;

            console.log('bookID:::',bookID);

            // 선택된 도서 API 호출
            const bookDetailResponse = await axios.get(`${process.env.BOOK_API_URL}srchDtlList?authKey=${process.env.BOOK_API_KEY}&isbn13=${bookID}&format=json`);
            const bookDetail = bookDetailResponse.data.response;

            // 선택된 도서 응답
            if (!bookDetail || bookDetail.length === 0) {
                return res.status(404).json({ message: '선택 도서 없음' });
            }

            console.log('BOOK DETAIL:::', bookDetail);
            
            // 관련 도서 API 호출
            const bookRelatedResponse = await axios.get(`${process.env.BOOK_API_URL}recommandList?authKey=${process.env.BOOK_API_KEY}&type=reader&isbn13=${bookID}&format=json`);
            const bookRelated = bookRelatedResponse.data.response.docs;

            // 관련 도서 응답
            if (!bookRelated || bookRelated.length === 0) {
                return res.status(404).json({ message: '관련 도서 없음' });
            }

            console.log('BOOK RELATED:::', bookRelated);

            // 선택된 도서 전달
            return res.json({ bookDetail, bookRelated });
        } catch (error) {
            console.error('Error fetching books:', error);
            return res.status(500).json({ error: 'Failed to fetch books', details: error.message });
        }
    },

    search_book: async (req, res) => {
      const { title, author, publisher, isbn13, sort, pageNo } = req.query;
        console.log('검색어 입력값:', { title, author, publisher, isbn13, sort, pageNo });
        try {
          const response = await axios.get(`${process.env.BOOK_API_URL}srchBooks?authKey=${process.env.BOOK_API_KEY}`, {
            params: {
              title,
              author,
              publisher,
              isbn13,
              sort,
              pageNo,
              pageSize: 10,
              format: 'json',  // json 형식으로 응답 받기
            },
          });

          // console.log('response ::: ', response);
          console.log('book ::: ', response.data.response);

          let books = response.data.response.docs;
          let totalCounts = response.data.response.numFound;
          let totalCount = (totalCounts > 1000 ? 1000 : totalCounts);

          console.log('books ::: ', books);
      
          res.json({ books, totalCount });
        } catch (error) {
          console.error('Error fetching books from API:', error);
          res.status(500).send('Error fetching books');
        }
    },

    search_library: async (req, res) => {
      const { title, isbn, region, pageNo } = req.query;
      console.log('검색어 입력값:', { title, isbn, region, pageNo });
    
      try {
        let response;
    
        // isbn 값이 없는 경우, title로 검색하여 isbn 추출
        if (!isbn && title) {
          console.log('제목으로 검색 중...');
          const bookResponse = await axios.get(`${process.env.BOOK_API_URL}srchBooks`, {
            params: {
              authKey: process.env.BOOK_API_KEY,
              title,
              pageSize: 1,
              format: 'json',
            },
          });
          
          console.log('11111', bookResponse.data.response);

          const searchBooks = bookResponse.data.response.docs;
          if (!searchBooks || searchBooks.length === 0) {
            return res.status(404).json({ message: '해당 제목으로 검색된 도서가 없습니다.' });
          }

          console.log('22222', searchBooks);
    
          const bookIsbn = searchBooks[0].doc.isbn13;
          console.log('추출된 ISBN:', bookIsbn);
    
          // 추출한 ISBN으로 다시 도서관 검색 실행
          response = await axios.get(`${process.env.BOOK_API_URL}libSrchByBook`, {
            params: {
              authKey: process.env.BOOK_API_KEY,
              isbn: bookIsbn,
              region,
              pageNo,
              pageSize: 10,
              format: 'json',
            },
          });
        } 
        // isbn 값이 있는 경우 바로 도서관 검색 실행
        else if (isbn) {
          console.log('ISBN으로 검색 중...');
          response = await axios.get(`${process.env.BOOK_API_URL}libSrchByBook`, {
            params: {
              authKey: process.env.BOOK_API_KEY,
              isbn,
              region,
              pageNo,
              pageSize: 10,
              format: 'json',
            },
          });
        } else {
          // title과 isbn 모두 없을 경우 에러 반환
          return res.status(400).json({ message: 'title 또는 isbn 중 하나는 필수입니다.' });
        }
    
        console.log('API 응답 데이터:', response.data.response);
    
        let libraries = response.data.response.libs || [];
        let totalCount = response.data.response.numFound || 0;
    
        console.log('검색된 도서관:', libraries);
    
        res.json({ libraries, totalCount });
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        res.status(500).send('도서 정보를 가져오는 중 오류가 발생했습니다.');
      }
    },
    
};

module.exports = bookService;