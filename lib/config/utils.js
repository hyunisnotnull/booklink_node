// HTML 엔티티 제거 함수
function removeMiddleDot(data) {
  return data.map(item => {
      if (!item.operatingTime) {
          item.operatingTime = '-';
      } else {
          item.operatingTime = item.operatingTime.replace(/&[^;]+;/g, ''); 
      }
      return item;
  });
}

// 어제 날짜 구하기 함수
function getYesterdaysDate() {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 지난 달 구하기 함수  
function getLastMonth() {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
};

// 현재 날짜 기준으로 올해 1월 1일 또는 작년 1월 1일 구하기
function getFirstDayOfYear() {
    const today = new Date();
    const year = today.getFullYear();
    
    // 만약 오늘이 1월이라면 작년의 1월 1일을 반환
    if (today.getMonth() === 0) { // 0은 1월을 의미
        return `${year - 1}-01-01`;
    }
    
    // 그렇지 않으면 올해의 1월 1일을 반환
    return `${year}-01-01`;
}

module.exports = {removeMiddleDot, getYesterdaysDate, getLastMonth, getFirstDayOfYear};