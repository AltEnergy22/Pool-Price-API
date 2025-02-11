const fetchPoolPrices = async () => {
  try {
    const apiUrl = 'https://apimgw.aeso.ca/public/poolprice-api/v1.1/price/poolPrice';
    
    // Get today's date and format it
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    
    // Get date 30 days ago
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
    // Use JSON.stringify with formatting to see the full structure
    console.log('Fetched Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchPoolPrices(); 