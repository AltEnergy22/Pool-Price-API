async function fetchPoolPrices() {
    try {
        // Get today's date and 30 days ago
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const apiUrl = 'https://apimgw.aeso.ca/public/poolprice-api/v1.1/price/poolPrice';
        const params = new URLSearchParams({
            startDate: startDate,
            endDate: endDate
        });

        console.log('Fetching pool prices...');
        console.log('URL:', `${apiUrl}?${params.toString()}`);
        console.log('Headers:', {
            'Cache-Control': 'no-cache',
            'API-KEY': '9a3cf04718fb450691da5375356d6a1e',
            'Accept': 'application/json'
        });
        
        const response = await fetch(`${apiUrl}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'API-KEY': '9a3cf04718fb450691da5375356d6a1e',
                'Accept': 'application/json'
            }
        });

        console.log('\nResponse Status:', response.status);
        console.log('Response Headers:', Object.fromEntries(response.headers));

        const responseText = await response.text();
        console.log('\nRaw Response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
            console.log('\nParsed Data:', data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
        }

        if (data && Array.isArray(data)) {
            console.log('\nPool Prices (Mountain Time):');
            console.log('Date\t\tTime\t\tPrice\t\tForecast\t30-Day Avg');
            console.log('-------------------------------------------------------------------------');
            
            data.forEach(entry => {
                const [date, time] = entry.begin_datetime_mpt.split(' ');
                const price = parseFloat(entry.pool_price).toFixed(2);
                const forecast = parseFloat(entry.forecast_pool_price).toFixed(2);
                const avg = parseFloat(entry.rolling_30day_avg).toFixed(2);
                
                console.log(`${date}\t${time}\t${price}\t\t${forecast}\t\t${avg}`);
            });
        } else {
            console.log('\nData Structure:', {
                type: typeof data,
                isArray: Array.isArray(data),
                keys: data ? Object.keys(data) : 'none'
            });
            console.log('No price data available');
        }
        
    } catch (error) {
        console.error('\nError Details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
    }
}

// Change this from directly running to exporting
export { fetchPoolPrices };