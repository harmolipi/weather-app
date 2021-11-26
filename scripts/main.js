const weatherDescription = document.querySelector('#weather-description');
const temperature = document.querySelector('#temperature');
const city = document.querySelector('#city');
const search = document.querySelector('#search');

async function getWeather(city) {
  const weather = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4cf257de9e7e2d1db89a64d36496144f&units=imperial`,
    { mode: 'cors' }
  );
  const weatherObject = await weather.json();
  const processedWeather = processWeather(weatherObject);
  return processedWeather;
}

async function processWeather(weather) {
  const processedWeatherObject = {
    city: weather.name,
    name: weather.weather[0].main,
    description: weather.weather[0].description,
    currentTemp: weather.main.temp,
    highTemp: weather.main.temp_max,
    lowTemp: weather.main.temp_min,
  };
  return processedWeatherObject;
}

async function updateWeatherDisplay(city) {
  setLoading();
  const weather = await getWeather(city);
  weatherDescription.textContent = `The current weather in ${weather.city} is ${weather.description}.`;
  temperature.textContent = `Currently, it's ${weather.currentTemp}°, with a high of ${weather.highTemp}° and a low of ${weather.lowTemp}°.`;
}

function setLoading() {
  weatherDescription.textContent = 'Loading...';
  temperature.textContent = '';
}

search.addEventListener('click', (e) => {
  e.preventDefault();
  updateWeatherDisplay(city.value);
});
