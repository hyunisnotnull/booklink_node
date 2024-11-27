function removeMiddleDot(data) {
  return data.map(item => {
      if (!item.operatingTime) {
          item.operatingTime = '-';
      } else {
          item.operatingTime = item.operatingTime.replace(/&[^;]+;/g, ''); // 모든 HTML 엔티티 제거
      }
      return item;
  });
}

module.exports = removeMiddleDot;