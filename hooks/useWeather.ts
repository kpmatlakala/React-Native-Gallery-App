import { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = "895284fb2d2c50a520ea537456963d9c"; 
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';

const useWeather = (query, useCoordinates = false) => {
const [weatherData, setWeatherData] = useState(null);
const [weatherLoading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
    if (!query) return; 
    console.log("Query: ", query, ".", useCoordinates);
    
    const getWeather = async () => {
        setLoading(true);
        setError(null);

        try 
        {
            let response;
            if (useCoordinates) 
            {
                const [lat, lon] = query.split(',').map(Number);
                if (isNaN(lat) || isNaN(lon)) 
                {
                    setError('Invalid coordinates');
                    return;
                }
            
                response = await axios.get(baseUrl, {
                    params: {
                    lat,
                    lon,
                    appid: apiKey,
                    units: 'metric', // Temperature in Celsius, use 'imperial' for Fahrenheit
                    },
                });
            } 
            else 
            {
                // Use city name
                response = await axios.get(baseUrl, {
                    params: {
                    q: query,
                    appid: apiKey,
                    units: 'metric',
                    },
                });
            }

            setWeatherData(response.data);
        } 
        catch (err) 
        {
            setError('City or coordinates not found or API error');
        } finally { setLoading(false);  }
    };

    getWeather();
}, [query, useCoordinates]);

return { weatherData, weatherLoading, error };
};

export default useWeather;
