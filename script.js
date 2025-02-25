const defaultCities = ["Delhi", "Mumbai", "Kolkata", "Chennai"];

async function loadDefaultCities() {
    for (let city of defaultCities) {
        let weatherData = await fetchWeather(city);
        updateCityWeather(city, weatherData);
    }
}

async function getWeather(city = null) {
    if (!city) {
        city = document.getElementById("cityInput").value.trim();
        if (!city) {
            alert("Please enter a city name");
            return;
        }
    }

    let weatherData = await fetchWeather(city);
    let weatherInfoContainer = document.getElementById("weatherInfoContainer");
    weatherInfoContainer.innerHTML = "";

    if (weatherData) {
        weatherInfoContainer.innerHTML = `
            <div class="weather-box">${createWeatherBox(city, weatherData)}</div>
            <div class="forecast-container">${createForecastBox(weatherData)}</div>
        `;
    } else {
        weatherInfoContainer.innerHTML = `<div class="weather-box"><p>Weather data not available.</p></div>`;
    }
}

async function fetchWeather(city) {
    let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    try {
        let geoResponse = await fetch(geoUrl);
        let geoData = await geoResponse.json();

        if (!geoData.results) return null;

        let lat = geoData.results[0].latitude;
        let lon = geoData.results[0].longitude;

        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

        let weatherResponse = await fetch(weatherUrl);
        let weatherData = await weatherResponse.json();

        return weatherData;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

function getWeatherIcon(weatherCode) {
    let icons = {
        0: '<i class="fas fa-sun"></i>',
        1: '<i class="fas fa-cloud-sun"></i>',
        2: '<i class="fas fa-cloud"></i>',
        3: '<i class="fas fa-cloud"></i>',
        45: '<i class="fas fa-smog"></i>',
        48: '<i class="fas fa-smog"></i>',
        51: '<i class="fas fa-cloud-rain"></i>',
        53: '<i class="fas fa-cloud-showers-heavy"></i>',
        55: '<i class="fas fa-cloud-showers-heavy"></i>',
        61: '<i class="fas fa-cloud-showers-heavy"></i>',
        63: '<i class="fas fa-bolt"></i>',
        65: '<i class="fas fa-bolt"></i>',
        80: '<i class="fas fa-cloud-rain"></i>',
        81: '<i class="fas fa-cloud-showers-heavy"></i>',
        82: '<i class="fas fa-poo-storm"></i>',
    };

    return icons[weatherCode] || '<i class="fas fa-question"></i>';
}

function updateCityWeather(city, weatherData) {
    if (!weatherData) return;

    let currentWeather = weatherData.current_weather;
    let iconElement = document.getElementById(`${city.toLowerCase()}-icon`);
    let tempElement = document.getElementById(`${city.toLowerCase()}-temp`);
    let descElement = document.getElementById(`${city.toLowerCase()}-desc`);

    if (iconElement && tempElement && descElement) {
        iconElement.innerHTML = getWeatherIcon(currentWeather.weathercode);
        tempElement.innerHTML = `${currentWeather.temperature}°C`;
        descElement.innerHTML = `💨 ${currentWeather.windspeed} km/h`;
    }
}

function createWeatherBox(city, weatherData) {
    if (!weatherData) return `<div class="city-box"><p>Weather not available</p></div>`;

    let currentWeather = weatherData.current_weather;
    let weatherIcon = getWeatherIcon(currentWeather.weathercode);

    return `
        <div class="city-box">
            <h3>${city}</h3>
            <p class="weather-icon">${weatherIcon}</p>
            <p>🌡 ${currentWeather.temperature}°C</p>
            <p>💨 Wind: ${currentWeather.windspeed} km/h</p>
        </div>
    `;
}

function createForecastBox(weatherData) {
    if (!weatherData || !weatherData.daily) return "";

    let days = weatherData.daily.time;
    let maxTemps = weatherData.daily.temperature_2m_max;
    let minTemps = weatherData.daily.temperature_2m_min;
    let weatherCodes = weatherData.daily.weathercode;

    let forecastHTML = `<div class="forecast-box">`;

    for (let i = 0; i < days.length; i++) {
        let date = new Date(days[i]);
        let dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        forecastHTML += `
            <div class="forecast-day">
                <p>${dayName}</p>
                <p class="weather-icon">${getWeatherIcon(weatherCodes[i])}</p>
                <p>🌡 ${minTemps[i]}°C - ${maxTemps[i]}°C</p>
            </div>
        `;
    }

    forecastHTML += `</div>`;
    return forecastHTML;
}

// Load Default Cities on Page Load
window.onload = loadDefaultCities;
