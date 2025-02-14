import React, { useState, useEffect } from 'react';
import PoolPriceChart from './components/PoolPriceChart';

function App() {
  const [priceData, setPriceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setIsLoading(true);
        
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const startDate = thirtyDaysAgo.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0];

        const apiUrl = `https://apimgw.aeso.ca/public/poolprice-api/v1.1/price/poolPrice?startDate=${startDate}&endDate=${endDate}`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'API-KEY': '9a3cf04718fb450691da5375356d6a1e',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.log('API Error Response:', errorText);
          throw new Error(`API responded with status ${response.status}: ${errorText}`);
        }

        const rawText = await response.text();
        console.log('Raw API Response:', rawText);

        let data;
        try {
          data = JSON.parse(rawText);
          console.log('Parsed JSON:', data);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          throw new Error('Failed to parse API response as JSON');
        }
        
        // Extract the Pool Price Report array from the nested structure
        const priceReports = data.return['Pool Price Report'];
        
        if (!Array.isArray(priceReports)) {
          throw new Error('Price report data is not in expected format');
        }
        
        const formattedData = priceReports.map(item => ({
          timestamp: item.begin_datetime_mpt,
          price: parseFloat(item.pool_price)
        }));
        
        console.log('Formatted Data:', formattedData);
        setPriceData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Detailed error:', error);
        setError(`Failed to load price data: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchPriceData();
  }, []);

  if (error) return (
    <div className="text-red-500 p-4">
      Error: {error}
      <br />
      Please check the console for more details.
    </div>
  );
  
  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-4xl mx-auto">
        <PoolPriceChart priceData={priceData} />
      </div>
    </div>
  );
}

export default App; 