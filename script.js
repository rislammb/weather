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
    `https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`
  )
    .then(res => res.json())
    .then(res => init(res))
    .catch(() => showError());
}

function init(resultFromServer) {
  if (resultFromServer.cod === '404') {
    showError(resultFromServer);
  } else if (resultFromServer.cod === 200) {
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
      'https://openweathermap.org/img/w/' +
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
  } else {
    showError();
  }
}

function setPositionForWeatherInfo() {
  const weatherContainer = document.getElementById('weatherContainer');
  weatherContainerWidth = weatherContainer.clientWidth;

  weatherContainer.style.left = `calc(50% - ${weatherContainerWidth / 2}px)`;
  weatherContainer.style.top = `20%`;
  weatherContainer.style.visibility = 'visible';
}

function clearWeatherInfo() {
  document.getElementById('weatherDescriptionHeader').innerHTML = '';
  document.getElementById('temperature').innerHTML = '';
  document.getElementById('humidity').innerHTML = '';
  document.getElementById('winSpead').innerHTML = '';
  document.getElementById('cityHeader').innerHTML = '';
  document.getElementById('documentIconImg').src = '';
  document.getElementById('searchInput').value = '';
}

function showError(result) {
  clearWeatherInfo();
  const cityHeader = document.getElementById('cityHeader');
  document.body.style.backgroundImage = '';
  document.body.style.backgroundColor = '#e3e3e3';
  if (result.cod === '404') {
    cityHeader.innerHTML = 'City Not Found!';
  } else {
    cityHeader.innerHTML = 'Somethins went wrong!';
  }
  setPositionForWeatherInfo();
}

document.getElementById('searchForm').addEventListener('submit', e => {
  e.preventDefault();
  let searchTerm = document.getElementById('searchInput').value;
  if (searchTerm) searchWeather(searchTerm);
});
