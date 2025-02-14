export const processPoolPriceData = (rawData) => {
  return rawData.map(item => ({
    datetime: new Date(item.begin),
    price: parseFloat(item.price),
    forecastPrice: parseFloat(item.forecastPrice || 0),
    demand: parseFloat(item.demand || 0),
    supply: parseFloat(item.supply || 0)
  }));
};

export const groupDataByDay = (data) => {
  const grouped = data.reduce((acc, item) => {
    const date = item.datetime.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return grouped;
};

export const calculateDailyStats = (data) => {
  return Object.entries(groupDataByDay(data)).map(([date, prices]) => {
    const priceValues = prices.map(p => p.price);
    return {
      date,
      average: priceValues.reduce((a, b) => a + b, 0) / priceValues.length,
      min: Math.min(...priceValues),
      max: Math.max(...priceValues),
      count: priceValues.length
    };
  });
}; 