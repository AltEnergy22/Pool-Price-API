import React, { useState, useEffect } from 'react';

function App() {
  const [poolPrices, setPoolPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPoolPrices = async () => {
    try {
      const apiUrl = 'https://apimgw.aeso.ca/public/poolprice-api/v1.1/price/poolPrice';
      
      const today = new Date();
      const endDate = today.toISOString().split('T')[0];
      
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      const startDateFormatted = startDate.toISOString().split('T')[0];

      const params = new URLSearchParams({
        startDate: startDateFormatted,
        endDate: endDate
      });

      const response = await fetch(`${apiUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'API-KEY': '9a3cf04718fb450691da5375356d6a1e'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPoolPrices(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPoolPrices();
    
    // Set up auto-refresh every minute
    const interval = setInterval(fetchPoolPrices, 60000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <h1>Real-Time Pool Prices</h1>
      {/* Add your visualization here */}
      <pre>{JSON.stringify(poolPrices, null, 2)}</pre>
    </div>
  );
}

export default App; 