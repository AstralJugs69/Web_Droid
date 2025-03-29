import React, { useState, useEffect } from 'react';
import AppContainer from '../components/AppContainer';
import { useSound } from '../hooks/useSound';
import { useSettings } from '../contexts/SettingsContext';

interface WeatherData {
  temp: number;
  description: string;
  iconCode: number;
  location: string;
  // Additional current weather details
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  windDirection?: number;
  pressure?: number;
  precipitation?: number;
  // Forecast data
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  } | null;
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  } | null;
}

interface WeatherAppProps {
  closeApp: () => void;
}

const WeatherApp: React.FC<WeatherAppProps> = ({ closeApp }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataVisible, setDataVisible] = useState<boolean>(false);
  const { playSound } = useSound();
  const { tempUnit, defaultWeatherLocation } = useSettings();

  // Default coordinates (New York City)
  const defaultLat = 40.7128;
  const defaultLon = -74.0060;

  // Handle fade-in effect when data loads
  useEffect(() => {
    let timer: number;
    if (!loading && weatherData && !dataVisible) {
      timer = window.setTimeout(() => {
        setDataVisible(true);
      }, 100);
    } else if (loading) {
      setDataVisible(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, weatherData]);

  // Fetch weather data on component mount
  useEffect(() => {
    if (defaultWeatherLocation) {
      // Parse location from settings
      fetchWeatherByLocation(defaultWeatherLocation);
    } else {
      // Use geolocation if available, otherwise use default coords
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            fetchWeatherData(position.coords.latitude, position.coords.longitude);
          },
          error => {
            console.error('Geolocation error:', error);
            fetchWeatherData(defaultLat, defaultLon);
          }
        );
      } else {
    fetchWeatherData(defaultLat, defaultLon);
      }
    }
  }, [defaultWeatherLocation]);

  // New function to handle location-based search
  const fetchWeatherByLocation = async (locationQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if the locationQuery is coordinates in the format "lat,lon"
      const coordsMatch = locationQuery.match(/^(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)$/);
      
      if (coordsMatch) {
        // It's coordinates, parse them
        const lat = parseFloat(coordsMatch[1]);
        const lon = parseFloat(coordsMatch[3]);
        fetchWeatherData(lat, lon);
      } else {
        // It's a location name, use geocoding service
        // For simplicity, we're just using default coordinates here
        // In a real app, you would use a geocoding service to convert location to coordinates
        console.log(`Searching for location: ${locationQuery}`);
        // Mocking a geocoding result for demonstration
        fetchWeatherData(defaultLat, defaultLon);
      }
    } catch (err) {
      console.error('Error parsing location:', err);
      setError('Failed to parse location. Please try again.');
      setLoading(false);
      
      // Play an error sound
      playSound('/sounds/error.mp3', 0.3);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Play a click sound when starting to fetch
      playSound('/sounds/click.mp3', 0.3);
      
      // Updated API URL to include additional current weather details
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the data we need
      const weatherData: WeatherData = {
        temp: Math.round(data.current.temperature_2m),
        description: getWeatherDescription(data.current.weather_code),
        iconCode: data.current.weather_code,
        location: await getLocationName(lat, lon),
        // Additional current details
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: Math.round(data.current.relative_humidity_2m),
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: data.current.wind_direction_10m,
        pressure: Math.round(data.current.pressure_msl),
        precipitation: data.current.precipitation,
        // Forecast data
        hourly: data.hourly || null,
        daily: data.daily || null
      };
      
      setWeatherData(weatherData);
      setLoading(false);
      
      // Play a success sound when data is loaded
      playSound('/sounds/powerup.mp3', 0.3);
      
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again later.');
      setLoading(false);
      
      // Play an error sound
      playSound('/sounds/error.mp3', 0.3);
    }
  };

  // Helper function to get location name from coordinates
  const getLocationName = async (lat: number, lon: number): Promise<string> => {
    try {
      // Fallback to coordinates if we can't get a location name
      return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    } catch (error) {
      console.error('Error getting location name:', error);
      return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }
  };

  // Convert temperature based on user settings
  const convertTemperature = (celsius: number): number => {
    if (tempUnit === 'fahrenheit') {
      return Math.round((celsius * 9/5) + 32);
    }
    return Math.round(celsius);
  };

  // Format temperature with the correct unit
  const formatTemperature = (celsius: number): string => {
    return `${convertTemperature(celsius)}°${tempUnit === 'celsius' ? 'C' : 'F'}`;
  };

  // Get dynamic background gradient based on weather code
  const getWeatherBackground = (code: number): string => {
    // Clear sky / Sunny
    if (code === 0 || code === 1) {
      return 'bg-gradient-to-b from-primary/80 to-primary/40';
    }
    // Partly cloudy
    else if (code === 2) {
      return 'bg-gradient-to-b from-primary/60 to-surface-variant';
    }
    // Overcast
    else if (code === 3) {
      return 'bg-gradient-to-b from-surface-variant to-surface';
    }
    // Fog
    else if (code >= 45 && code <= 48) {
      return 'bg-gradient-to-b from-surface-variant to-surface';
    }
    // Rain / Drizzle
    else if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
      return 'bg-gradient-to-b from-tertiary/80 to-surface-variant';
    }
    // Snow
    else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      return 'bg-gradient-to-b from-surface to-tertiary/20';
    }
    // Thunderstorm
    else if (code >= 95) {
      return 'bg-gradient-to-b from-tertiary to-tertiary-container/80';
    }
    // Default
    return 'bg-gradient-to-b from-surface to-surface-light';
  };

  // Map weather code to description
  const getWeatherDescription = (code: number): string => {
    const weatherCodes: Record<number, string> = {
      0: 'clear sky',
      1: 'mainly clear',
      2: 'partly cloudy',
      3: 'overcast',
      45: 'fog',
      48: 'depositing rime fog',
      51: 'light drizzle',
      53: 'moderate drizzle',
      55: 'dense drizzle',
      56: 'light freezing drizzle',
      57: 'dense freezing drizzle',
      61: 'slight rain',
      63: 'moderate rain',
      65: 'heavy rain',
      66: 'light freezing rain',
      67: 'heavy freezing rain',
      71: 'slight snow fall',
      73: 'moderate snow fall',
      75: 'heavy snow fall',
      77: 'snow grains',
      80: 'slight rain showers',
      81: 'moderate rain showers',
      82: 'violent rain showers',
      85: 'slight snow showers',
      86: 'heavy snow showers',
      95: 'thunderstorm',
      96: 'thunderstorm with slight hail',
      99: 'thunderstorm with heavy hail'
    };

    return weatherCodes[code] || 'unknown';
  };

  // Map weather code to icon code
  const getIconCodeFromWeatherCode = (code: number): string => {
    // Simplified mapping
    if (code === 0) return '01d'; // clear sky
    if (code === 1) return '01d'; // mainly clear
    if (code === 2) return '02d'; // partly cloudy
    if (code === 3) return '03d'; // overcast
    if (code >= 45 && code <= 48) return '50d'; // fog
    if (code >= 51 && code <= 57) return '09d'; // drizzle
    if (code >= 61 && code <= 67) return '10d'; // rain
    if (code >= 71 && code <= 77) return '13d'; // snow
    if (code >= 80 && code <= 82) return '09d'; // rain showers
    if (code >= 85 && code <= 86) return '13d'; // snow showers
    if (code >= 95) return '11d'; // thunderstorm
    return '01d'; // default
  };

  // Helper function to get the appropriate weather icon emoji
  const getWeatherIcon = (iconCode: number): string => {
    // Map weather codes to emojis
    const iconMap: { [key: number]: string } = {
      0: '☀️', // Clear sky
      1: '🌤️', // Mainly clear
      2: '⛅', // Partly cloudy
      3: '☁️', // Overcast
      45: '🌫️', // Fog
      48: '🌫️', // Depositing rime fog
      51: '🌦️', // Drizzle: Light
      53: '🌦️', // Drizzle: Moderate
      55: '🌧️', // Drizzle: Dense
      56: '🌨️', // Freezing Drizzle: Light
      57: '🌨️', // Freezing Drizzle: Dense
      61: '🌧️', // Rain: Slight
      63: '🌧️', // Rain: Moderate
      65: '🌧️', // Rain: Heavy
      66: '🌨️', // Freezing Rain: Light
      67: '🌨️', // Freezing Rain: Heavy
      71: '❄️', // Snow fall: Slight
      73: '❄️', // Snow fall: Moderate
      75: '❄️', // Snow fall: Heavy
      77: '❄️', // Snow grains
      80: '🌧️', // Rain showers: Slight
      81: '🌧️', // Rain showers: Moderate
      82: '🌧️', // Rain showers: Violent
      85: '🌨️', // Snow showers: Slight
      86: '🌨️', // Snow showers: Heavy
      95: '⛈️', // Thunderstorm: Slight or moderate
      96: '⛈️', // Thunderstorm with slight hail
      99: '⛈️'  // Thunderstorm with heavy hail
    };

    return iconMap[iconCode] || '🌡️'; // Default icon if mapping not found
  };

  // Get wind direction as compass point
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Create app bar content
  const renderAppBar = () => {
    if (!weatherData) {
      return (
        <div className="w-full flex items-center justify-center">
          <h1 className="text-lg font-semibold font-sans animate-reveal-text">
            <span aria-hidden="true" className="invisible">Weather</span>
            <span className="absolute left-0 top-0">Weather</span>
          </h1>
        </div>
      );
    }

    return (
      <div className="w-full flex items-center justify-between px-2">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getWeatherIcon(weatherData.iconCode)}</span>
          <div>
            <h1 className="text-lg font-semibold font-sans animate-reveal-text">
              <span aria-hidden="true" className="invisible">{formatTemperature(weatherData.temp)}</span>
              <span className="absolute left-0 top-0">{formatTemperature(weatherData.temp)}</span>
            </h1>
            <p className="text-xs font-sans capitalize line-clamp-1">{weatherData.description}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={() => fetchWeatherByLocation(defaultWeatherLocation || '')}
            className="p-2 rounded-btn hover:bg-surface-variant/50 active:scale-95 transition-all duration-200"
            aria-label="Refresh weather data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Render weather details grid
  const renderWeatherDetails = () => {
    if (!weatherData) return null;
    
    return (
      <div className={`flex flex-col ${dataVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        <div className="text-center p-6">
          <div className="text-6xl mb-2 font-light text-on-surface font-sans">
            {formatTemperature(weatherData.temp)}
          </div>
          <div className="text-xl font-sans capitalize mb-1 text-on-surface">{weatherData.description}</div>
          <div className="text-sm font-sans text-on-surface">{weatherData.location}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 px-4 py-2">
          {weatherData.feelsLike !== undefined && (
            <div className="bg-surface-variant/20 rounded-btn p-3">
              <div className="text-xs text-on-surface-variant mb-1">Feels Like</div>
              <div className="text-lg text-on-surface font-sans">{formatTemperature(weatherData.feelsLike)}</div>
            </div>
          )}
          
          {weatherData.humidity !== undefined && (
            <div className="bg-surface-variant/20 rounded-btn p-3">
              <div className="text-xs text-on-surface-variant mb-1">Humidity</div>
              <div className="text-lg text-on-surface font-sans">{weatherData.humidity}%</div>
            </div>
          )}
          
          {weatherData.windSpeed !== undefined && weatherData.windDirection !== undefined && (
            <div className="bg-surface-variant/20 rounded-btn p-3">
              <div className="text-xs text-on-surface-variant mb-1">Wind</div>
              <div className="text-lg text-on-surface font-sans">{weatherData.windSpeed} km/h</div>
              {weatherData.windDirection !== undefined && (
                <div className="text-xs text-on-surface-variant">{getWindDirection(weatherData.windDirection)}</div>
              )}
            </div>
          )}
          
          {weatherData.pressure !== undefined && (
            <div className="bg-surface-variant/20 rounded-btn p-3">
              <div className="text-xs text-on-surface-variant mb-1">Pressure</div>
              <div className="text-lg text-on-surface font-sans">{weatherData.pressure} hPa</div>
            </div>
          )}
          
          {weatherData.precipitation !== undefined && weatherData.precipitation > 0 && (
            <div className="bg-surface-variant/20 rounded-btn p-3">
              <div className="text-xs text-on-surface-variant mb-1">Precipitation</div>
              <div className="text-lg text-on-surface font-sans">{weatherData.precipitation} mm</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render hourly forecast items
  const renderHourlyForecast = () => {
    if (!weatherData || !weatherData.hourly || !dataVisible) return null;
    
    // Take just the next 24 hours
    const times = weatherData.hourly.time.slice(0, 24);
    const temps = weatherData.hourly.temperature_2m.slice(0, 24);
    const codes = weatherData.hourly.weather_code.slice(0, 24);
    
    return (
      <div className="mt-2 px-4">
        <h3 className="text-sm font-semibold mb-2">24-Hour Forecast</h3>
        <div className="flex overflow-x-auto pb-2 gap-3">
          {times.map((time, index) => {
            const hour = new Date(time).getHours();
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            
            return (
              <div key={time} className="flex flex-col items-center min-w-[50px]">
                <div className="text-xs mb-1">{displayHour}{ampm}</div>
                <div className="text-lg">{getWeatherIcon(codes[index])}</div>
                <div className="text-sm font-semibold">{convertTemperature(temps[index])}°</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render daily forecast items
  const renderDailyForecast = () => {
    if (!weatherData || !weatherData.daily || !dataVisible) return null;
    
    // Format day of week
    const getDayName = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    };
    
    // We've already checked that weatherData.daily is not null above
    const { time, weather_code, temperature_2m_max, temperature_2m_min } = weatherData.daily;
    
    return (
      <div className="mt-4 px-4 pb-20">
        <h3 className="text-sm font-semibold mb-2">7-Day Forecast</h3>
        <div className="space-y-2">
          {time.map((date, index) => (
            <div key={date} className="flex items-center justify-between bg-surface-variant/20 rounded-btn p-3">
              <div className="flex items-center">
                <div className="w-10 text-sm">{getDayName(date)}</div>
                <div className="text-xl mr-3">{getWeatherIcon(weather_code[index])}</div>
              </div>
              <div className="flex space-x-2">
                <span className="text-sm font-semibold">{convertTemperature(temperature_2m_max[index])}°</span>
                <span className="text-sm opacity-70">{convertTemperature(temperature_2m_min[index])}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get dynamic background class based on weather
  const getBackgroundClass = () => {
    if (!weatherData) return '';
    return getWeatherBackground(weatherData.iconCode);
  };

  return (
    <AppContainer
      appId="weather"
      showAppBar={true}
      appBarContent={renderAppBar()}
    >
      <div className={`w-full h-full flex flex-col text-on-surface overflow-y-auto bg-page-background ${getBackgroundClass()} transition-all duration-500`}>
          {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-pulse text-4xl mb-4">🌦️</div>
            <div className="text-lg font-medium font-sans">Loading weather data...</div>
          </div>
          ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <div className="text-lg font-medium font-sans text-error mb-2">
              {error}
            </div>
            <button
              onClick={() => fetchWeatherData(defaultLat, defaultLon)}
              className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-btn text-sm font-medium hover:bg-primary-container transition-colors"
            >
              Try Again
            </button>
          </div>
          ) : weatherData ? (
          <div className={`flex-grow transition-opacity duration-500 ${dataVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="text-8xl my-5 drop-shadow-md">
                {getWeatherIcon(weatherData.iconCode)}
              </div>
              <div className="text-8xl font-light my-4 drop-shadow-sm font-sans text-on-surface">
                {formatTemperature(weatherData.temp)}
              </div>
              <div className="text-2xl capitalize my-3 font-medium font-sans text-on-surface">
                {weatherData.description}
              </div>
              <div className="text-sm text-on-surface-variant my-2 font-sans">
                {weatherData.location}
              </div>
            </div>

            {/* Weather details section */}
            {renderWeatherDetails()}

            {/* Hourly forecast section */}
            {renderHourlyForecast()}
            
            {/* Daily forecast section */}
            {renderDailyForecast()}
            
            <div className="flex-shrink-0 text-xs text-center font-sans text-on-surface-variant p-4 mb-2 backdrop-blur-sm bg-surface-variant/20 mx-4 rounded-btn">
              Weather data powered by Open-Meteo
            </div>
          </div>
        ) : null}
      </div>
    </AppContainer>
  );
};

export default WeatherApp; 