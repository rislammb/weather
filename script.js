const appId = '2d4d3e10487d20dd90999922448bc7e1';
const units = 'metric';
let searchMethod;

function getSearchMethod(searchTerm) {
  if (
    searchTerm.length === 5 &&
    Number.parseInt(searchTerm) + '' === searchTerm
  )
    searchMethod = 'zip';
  else searchMethod = 'q';
}

function searchWeather(searchTerm) {
  getSearchMethod(searchTerm);
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`
  )
    .then(res => res.json())
    .then(res => init(res))
    .catch(err => console.log(err));
}

function init(resultFromServer) {
  switch (resultFromServer.weather[0].main) {
    case 'Clear':
      document.body.style.backgroundImage = 'url("./img/clear.jpg")';
      break;
    case 'Clouds':
      document.body.style.backgroundImage = 'url("./img/cloudy.jpg")';
      break;
    case 'Rain':
    case 'Drizzle':
    case 'Mist':
      document.body.style.backgroundImage = 'url("./img/rain.jpg")';
      break;
    case 'Thunderstorm':
      document.body.style.backgroundImage = 'url("./img/storm.jpg")';
      break;
    case 'Snow':
      document.body.style.backgroundImage = 'url("./img/snow.jpg")';
      break;
    default:
      document.body.style.backgroundColor = '#e3e3e3';
      break;
  }

  const weatherDescriptionHeader = document.getElementById(
    'weatherDescriptionHeader'
  );
  const temperature = document.getElementById('temperature');
  const humidity = document.getElementById('humidity');
  const winSpead = document.getElementById('winSpead');
  const cityHeader = document.getElementById('cityHeader');
  const weatherIcon = document.getElementById('documentIconImg');

  weatherIcon.src =
    'http://openweathermap.org/img/w/' +
    resultFromServer.weather[0].icon +
    '.png';
  const resultDescription = resultFromServer.weather[0].description;
  weatherDescriptionHeader.innerText =
    resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);
  temperature.innerHTML = Math.floor(resultFromServer.main.temp) + '&#176C';
  winSpead.innerHTML =
    'Winds at ' + Math.floor(resultFromServer.wind.speed) + ' m/s';
  cityHeader.innerHTML =
    resultFromServer.name + ', ' + resultFromServer.sys.country;
  humidity.innerHTML =
    'Humidity levels at ' + resultFromServer.main.humidity + '%';

  setPositionForWeatherInfo();
  document.getElementById('searchInput').value = '';
}

function setPositionForWeatherInfo() {
  const weatherContainer = document.getElementById('weatherContainer');
  weatherContainerHeight = weatherContainer.clientHeight;
  weatherContainerWidth = weatherContainer.clientWidth;

  weatherContainer.style.left = `calc(50% - ${weatherContainerWidth / 2}px)`;
  weatherContainer.style.top = `calc(50% - ${weatherContainerHeight / 1.6}px)`;
  weatherContainer.style.visibility = 'visible';
}

document.getElementById('searchBtn').addEventListener('click', () => {
  let searchTerm = document.getElementById('searchInput').value;
  if (searchTerm) searchWeather(searchTerm);
});
