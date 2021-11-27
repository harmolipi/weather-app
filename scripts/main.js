const body = document.querySelector('body');
const weatherDescription = document.querySelector('#weather-description');
const temperature = document.querySelector('#temperature');
const city = document.querySelector('#city');
const unitsSelectors = document.querySelectorAll('.unit-selector');
const search = document.querySelector('#search');
const img = document.querySelector('img');

async function getWeather(city) {
  const units = getUnits();
  const weather = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4cf257de9e7e2d1db89a64d36496144f&units=${units}`,
    { mode: 'cors' }
  );
  const weatherObject = await weather.json();
  const processedWeather = processWeather(weatherObject);
  return processedWeather;
}

function getUnits() {
  let units = 'imperial';
  unitsSelectors.forEach((selector) => {
    if (selector.checked) {
      units = selector.value;
    }
  });
  return units;
}

async function processWeather(weather) {
  const processedWeatherObject = {
    city: weather.name,
    name: weather.weather[0].main,
    description: weather.weather[0].description,
    currentTemp: weather.main.temp,
    highTemp: weather.main.temp_max,
    lowTemp: weather.main.temp_min,
    sunrise: weather.sys.sunrise,
    sunset: weather.sys.sunset,
  };
  return processedWeatherObject;
}

async function updateWeatherDisplay(city, units) {
  setLoading();
  try {
    const weather = await getWeather(city, units);
    weatherDescription.textContent = `The current weather in ${weather.city} is ${weather.description}.`;
    temperature.textContent = `Currently, it's ${weather.currentTemp}°, with a high of ${weather.highTemp}° and a low of ${weather.lowTemp}°.`;
    updateStyles(weather);
  } catch {
    weatherDescription.textContent =
      'There was an error getting the weather for that city.';
  }
}

function setLoading() {
  weatherDescription.textContent = 'Loading...';
  temperature.textContent = '';
}

function updateStyles(weather) {
  img.src = '';
  body.classList.remove('dark-mode');
  const currentDateTime = Date.now();
  const currentTime = currentDateTime / 1000; // not sure why but it works (I think)
  if (currentTime < weather.sunrise || currentTime > weather.sunset) {
    body.classList.add('dark-mode');
  }
  displayGif(weather.description);
}

async function displayGif(weatherDescription) {
  try {
    const weatherGif = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=k4qXK4p5ZdNoUEolAurib521ZYrPolMU&s=${weatherDescription}`,
      { mode: 'cors' }
    );
    const processedWeatherGif = await weatherGif.json();
    img.src = processedWeatherGif.data.images.original.url;
  } catch (e) {
    console.log(e);
  }
}

search.addEventListener('click', (e) => {
  e.preventDefault();
  updateWeatherDisplay(city.value);
});
