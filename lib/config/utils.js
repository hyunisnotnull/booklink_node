function removeMiddleDot(data) {
    return data.map(item => {
      // operatingTime에서 &middot; 제거
      item.operatingTime = item.operatingTime.replace(/&[^;]+;/g, ''); // 모든 HTML 엔티티 제거
      return item;
    });
  }

  module.exports = removeMiddleDot;