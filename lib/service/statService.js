const axios = require('axios');

const statService = {
    book_read: async (req, res) => {
        const { ageGroup, year } = req.query; // 연도와 연령대 수신
        try {
            // Spring 서버로 데이터 요청
            const response = await axios.get(`${process.env.SPRING_URL}/stat/getBookRead`);
            const rawData = response.data;

            // 데이터에서 연도와 월 분리
            const yearFilteredData = year
                ? rawData.filter(item => item.month.startsWith(year)) // month에서 연도 확인
                : rawData;

            // 월별 카테고리 추출
            const categories = [...new Set(yearFilteredData.map(item => item.month.split('-')[1]))];

            // 특정 연령대 필터링
            const filteredData = ageGroup && ageGroup !== 'all'
                ? yearFilteredData.filter(item => item.age == ageGroup)
                : yearFilteredData;

            // 남자 데이터 생성
            const maleData = categories.map(month =>
                filteredData
                    .filter(item => item.month.endsWith(month) && item.gender === 'M')
                    .reduce((sum, curr) => sum + curr.count, 0)
            );

            // 여자 데이터 생성
            const femaleData = categories.map(month =>
                filteredData
                    .filter(item => item.month.endsWith(month) && item.gender === 'W')
                    .reduce((sum, curr) => sum + curr.count, 0)
            );

            // 결과 반환
            res.json({
                series: [
                    { name: '남자', data: maleData },
                    { name: '여자', data: femaleData },
                ],
                categories,
            });
        } catch (error) {
            console.error('Error fetching book read data:', error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    },

    book_rank: async (req, res) => {
        const { ageGroup, year, month, gender } = req.query; // 연도, 월, 성별, 연령대 수신
        try {
            // Spring 서버로 데이터 요청
            const response = await axios.get(`${process.env.SPRING_URL}/stat/getBookRank`, {
                params: { year, month, gender, ageGroup },
            });
            const rawData = response.data;

            // 데이터 가공
            const categories = rawData.map((item) => item.name); // 도서 이름
            const data = rawData.map((item) => item.count); // 도서 찜 횟수

            // 월 옵션 생성
            const monthOptions = [...new Set(rawData.map((item) => item.month.split('-')[1]))]; // 월만 추출 후 중복 제거

            // 응답 데이터 생성
            res.json({
                categories,
                series: [{ name: '찜 횟수', data }], // 차트 데이터 (도서별 찜 횟수)
                monthOptions,
            });
        } catch (error) {
            console.error('Error fetching book rank data:', error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    },

    library_rank: async (req, res) => {
        const { ageGroup, year, month, gender, region } = req.query; // 연도, 월, 성별, 연령대, 지역 수신
        try {
            // Spring 서버로 데이터 요청
            const response = await axios.get(`${process.env.SPRING_URL}/stat/getLibraryRank`, {
                params: { year, month, gender, ageGroup, region },
            });
            const rawData = response.data;
            console.log('rawData---', rawData);

            // 데이터 가공
            const labels = rawData.map((item) => item.libraryName); // 도서관 이름
            const series = rawData.map((item) => item.count); // 도서관별 찜 횟수
            const total = series.reduce((acc, value) => acc + value, 0); // 총 찜 횟수 계산
            const regions = [...new Set(rawData.map((item) => item.libraryAddress.split(' ')[0]))]; // 지역 옵션 추출
            console.log('regions---', regions);

            // 월 옵션 생성
            const monthOptions = [...new Set(rawData.map((item) => item.month.split('-')[1]))]; // 월만 추출 후 중복 제거

            // 응답 데이터 생성
            res.json({
                labels,        // RadialBar 차트의 레이블
                series,        // RadialBar 차트의 데이터
                total,         // 총 찜 횟수
                regions,
                monthOptions,
            });
        } catch (error) {
            console.error('Error fetching library rank data:', error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    },
};

module.exports = statService;
