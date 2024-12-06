const axios = require('axios');

const statService = {
    book_read: async (req, res) => {
        const { ageGroup, year } = req.query; // 클라이언트로부터 연도와 연령대 수신
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
};

module.exports = statService;
