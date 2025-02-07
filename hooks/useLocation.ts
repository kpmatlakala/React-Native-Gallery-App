//useLocation
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

const useLocation = (city: string) => {
  const [searchedLat, setSearchedLat] = useState<number | null>(null);
  const [searchedLon, setSearchedLon] = useState<number | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<any>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getLocation = async (city: string) => {
    setLoading(true);
    try 
    {
      // Use expo-location's geocoding to get coordinates from city name
      const geocodeResults = await Location.geocodeAsync(city);
      
      if (geocodeResults.length === 0) 
      {
        throw new Error('No location found for this city.');
      }

      // Extract latitude and longitude
      const { latitude, longitude } = geocodeResults[0];
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      setSearchedLat(latitude);
      setSearchedLon(longitude);
      setSearchedLocation(reverseGeocode[0]);
      setLoading(false);

    } 
    catch (error) 
    {
      setErrMsg('Unable to fetch location data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      getLocation(city);
    }
  }, [city]);

  console.log("search_res", searchedLat, searchedLon, searchedLocation);

  return { searchedLat, searchedLon, searchedLocation, errMsg, loading };
};

export default useLocation;
