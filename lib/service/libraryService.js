const axios = require('axios');
const {removeMiddleDot} = require('../config/utils');

const libraryService = {
    updateLibraryJPA: async (req, res) => {
        try {
            const pageSize = 10;
            const format = 'json';

            // 첫 번째 요청을 통해 전체 도서관 개수와 페이지 수를 계산
            const firstPageRes = await axios.get(
                `${process.env.BOOK_API_URL}extends/libSrch`, {
                    params: {
                        authKey: process.env.BOOK_API_KEY,
                        pageNo: 1,
                        pageSize: pageSize,
                        format: format,
                    },
                    timeout: 30000
                }
            );

            const totalLibraries = firstPageRes.data.response.numFound;
            const totalPages = Math.ceil(totalLibraries / pageSize);

            // 페이지별로 데이터를 받아와서 바로 서버에 전송
            for (let page = 1; page <= totalPages; page++) {
                const pageRes = await axios.get(`${process.env.BOOK_API_URL}extends/libSrch`, {
                    params: {
                        authKey: process.env.BOOK_API_KEY,
                        pageNo: page,
                        pageSize: pageSize,
                        format: format,
                    },
                    timeout: 30000
                });

                const librariesFromPage = pageRes.data.response.libs.map(lib => lib.lib.libInfo);

                const cleanedLibraries = removeMiddleDot(librariesFromPage);
                console.log("Cleaned Libraries:", cleanedLibraries);

                // 각 페이지의 데이터를 스프링 서버로 바로 전송
                const springRes = await axios.post(`${process.env.SPRING_URL}/api/library/update`, cleanedLibraries);
                
                console.log(`Page ${page} data sent, ${librariesFromPage.length} libraries saved.`);

                // await sleep(1000);  // 1초 대기 (옵션)
            }

            return res.json({ message: '도서관 데이터가 성공적으로 저장되었습니다.' });

        } catch (error) {
            console.error('Error fetching libraries:', error);
            res.status(500).json({ error: 'Failed to fetch libraries', details: error.message });
        }
    },

    search_library_name: async (req, res) => {
        const { title, region, pageNo, pageSize = 10 } = req.query;
        console.log('검색어 입력값:', { title, region, pageNo, pageSize });

        try {
        // Spring 서버로 요청 전송
        const springResponse = await axios.get(`${process.env.SPRING_URL}/api/library/searchByName`,
            {params: { title, region }}
        );

        const searchData = springResponse.data; // 전체 데이터를 가져옴
        const totalItems = searchData.length; // 전체 데이터 개수

        // 페이징 계산
        const startIndex = (pageNo - 1) * pageSize; // 시작 인덱스 계산
        const endIndex = startIndex + parseInt(pageSize, 10); // 끝 인덱스 계산

        // 지정된 범위의 데이터만 추출
        const paginatedData = searchData.slice(startIndex, endIndex);

        console.log('페이징된 데이터:', paginatedData);
    
        res.status(200).json({
            pageNo: parseInt(pageNo, 10),
            pageSize: parseInt(pageSize, 10),
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            libs: paginatedData,
        });
        } catch (error) {
        console.error('Spring 서버와의 통신 에러:', error.message);
        res.status(500).json({ message: 'Spring 서버와의 통신에 실패했습니다.' });
        }
    },
  
    getLoanAvailable: async (req, res) => {
        const { bookID, latitude, longitude, libraryCode, libraryName } = req.query; 
    
        console.log('bookID:::', bookID);
        console.log('Location Data:', { latitude, longitude });
        console.log('libraryCode:', libraryCode);
        console.log('libraryName:', libraryName);
    
        try {
            if (libraryCode) {
                // libraryCode가 있으면 바로 API를 호출
                const url = `http://data4library.kr/api/bookExist?authKey=${process.env.BOOK_API_KEY}&libCode=${libraryCode}&isbn13=${bookID}&format=json`;
    
                try {
                    const response = await axios.get(url);
                    const { hasBook, loanAvailable } = response.data.response.result;
    
                    if (hasBook === 'Y' && loanAvailable === 'Y') { // 대출가능 도서만 처리
                        res.json({
                            libCode: libraryCode,
                            libName: libraryName,
                        });
                    } else {
                        res.json({});
                    }

                } catch (error) {
                    console.error(`Error fetching data from library API:`, error);
                    res.status(500).json({ error: 'Failed to fetch loan availability from library' });
                }
            } else {
                // libraryCode가 없으면 스프링 서버로 위치 정보와 함께 쿼리 파라미터 전송
                const response = await axios.get(`${process.env.SPRING_URL}/api/library/nearbyLibraries`, {
                    params: {
                        latitude,
                        longitude,
                    }
                });
    
                const libraryCodes = response.data;
    
                // 도서관 코드와 BookID로 대출 가능 여부 확인
                const loanAvailableResults = [];
    
                for (const library of libraryCodes) {
                    const libCode = library.l_CODE;
                    const libName = library.l_NAME;
                    const url = `http://data4library.kr/api/bookExist?authKey=${process.env.BOOK_API_KEY}&libCode=${libCode}&isbn13=${bookID}&format=json`;
    
                    try {
                        const response = await axios.get(url);
                        const { hasBook, loanAvailable } = response.data.response.result;
    
                        if (hasBook === 'Y') { // 소장 도서만 처리, 다 들고 올거면 if 문 삭제
                            loanAvailableResults.push({
                                libCode,
                                libName,
                                hasBook,
                                loanAvailable,
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching data from library API:`, error);
                    }
                }
    
                res.json({ libraries: loanAvailableResults });
            }
        } catch (error) {
            console.error('서버 에러 :', error);
            res.status(500).json({ error: 'Failed to fetch available libraries' });
        }
    },
    
    
};

module.exports = libraryService;
