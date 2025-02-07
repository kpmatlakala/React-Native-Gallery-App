import { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = "895284fb2d2c50a520ea537456963d9c"; 
const baseUrl = 'http://api.openweathermap.org/data/2.5';

const useForecast = (query, useCoordinates = false) => {    

    const [forecastData , setForecastData] = useState(null)
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    
    const [hourly, setHourly] = useState([]);
    const [daily, setDaily] = useState([]);

    const [forecastsLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(forecastData)
        {
            getDailyForecast();
            getHourlyForecast();
        }
        
    }, [forecastData]);

    useEffect(() => {
        if (!query) return;
        // console.log("fcQuery: ", query, ".", useCoordinates);

        const getForecasts = async () => {
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

                    const _res = await axios.get(`${baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                    response = _res.data.list;
                    // console.log(response);
                }
                else
                {   
                    const _res = await axios.get(`${baseUrl}/forecast?q=${query}&appid=${apiKey}&units=metric`);
                    response = _res.data.list;
                    // console.log(response);
                }                
            
                setForecastData(response);           
            } 
            catch (error) 
            {
                console.error("Error fetching weather forecast data:", error);
                setError("Error fetching weather forecast data:", error);
            } finally { setLoading(false);  }
        };

        getForecasts();

    }, [query, useCoordinates])

    const getHourlyForecast = () => {
        if (forecastData.length > 0) {
            const hourlyForecast = forecastData
                .filter((hourly) => hourly.dt >= forecastData[0].dt)
                .slice(0, 8); // Get next 8 hours
            setHourly(hourlyForecast);
        }
    };

    // Fetch and update Daily Forecast
    const getDailyForecast = () => {
        if (forecastData.length > 0) {
            const dailyForecast = forecastData.filter((forecast) => {
                const forecastDate = new Date(forecast.dt_txt);
                return forecastDate.getHours() === 12 && forecastDate >= new Date();
            });
            setDaily(dailyForecast);
        }
    };

    // console.log(" city ", forecastData);
    // console.log(" hourlyFC ", hourly);
    // console.log(" dailyFC ", daily);
    
    return ( { currentDate, hourly, daily, forecastsLoading, error } )
}

export default useForecast

