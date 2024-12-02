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

module.exports = {removeMiddleDot, getYesterdaysDate, getLastMonth};