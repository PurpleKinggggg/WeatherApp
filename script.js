async function getWeather() {
    let city = document.getElementById("cityInput").value;
    
    if (!city) {
        document.getElementById("weatherInfo").innerHTML = `<p>Please enter a city name</p>`;
        return;
    }

    let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    try {
        let geoResponse = await fetch(geoUrl);
        let geoData = await geoResponse.json();

        if (!geoData.results) {
            document.getElementById("weatherInfo").innerHTML = `<p>City not found</p>`;
            return;
        }

        let lat = geoData.results[0].latitude;
        let lon = geoData.results[0].longitude;

        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

        let weatherResponse = await fetch(weatherUrl);
        let weatherData = await weatherResponse.json();

        document.getElementById("weatherInfo").innerHTML = `
            <h2>${city}</h2>
            <p>🌡 Temperature: ${weatherData.current_weather.temperature}°C</p>
            <p>💨 Wind Speed: ${weatherData.current_weather.windspeed} km/h</p>
        `;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById("weatherInfo").innerHTML = "<p>Something went wrong!</p>";
    }
}
