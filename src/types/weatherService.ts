
const apiKey = process.env.API_KEY_WEATHER;
export const fetchWeatherData = async (lat: number | undefined, lon: number | undefined) => {
    try {
       const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
       console.log(response);
        const data = await response.json();
        console.log('Weather data response:', data);
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};
