import { useState, useEffect } from 'react';
import { fetchPoolPrices } from '../fetchprice';

export function usePoolPrices(startDate, endDate) {
  const [processedData, setProcessedData] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchPoolPrices(startDate, endDate);
        
        // Process the raw data
        const processed = data.map(item => ({
          date: item.begin_datetime_mpt,
          price: parseFloat(item.pool_price)
        }));
        setProcessedData(processed);

        // Calculate daily statistics
        const dailyData = processed.reduce((acc, curr) => {
          const date = curr.date.split('T')[0];
          if (!acc[date]) {
            acc[date] = {
              prices: []
            };
          }
          acc[date].prices.push(curr.price);
          return acc;
        }, {});

        const stats = Object.entries(dailyData).map(([date, data]) => ({
          date,
          average: data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length,
          min: Math.min(...data.prices),
          max: Math.max(...data.prices)
        }));

        setDailyStats(stats);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }

    loadData();
  }, [startDate, endDate]);

  return { processedData, dailyStats, isLoading, error };
} 