import axios from 'axios';

const API_KEY = '9a3cf04718fb450691da5375356d6a1e';
const BASE_URL = 'https://apimgw.aeso.ca/public/poolprice-api/v1.1/price/poolprice';

export const fetchPoolPrices = async (startDate, endDate) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { startDate, endDate },
      headers: {
        'Cache-Control': 'no-cache',
        'API-KEY': API_KEY,
      },
    });
    return response.data.return.poolPriceReport.timestamps.timestamp;
  } catch (error) {
    throw new Error('Failed to fetch pool prices');
  }
}; 