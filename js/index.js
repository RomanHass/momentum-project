'use strict';
import playList from './playList.js';

// Глобальные переменные
const time = document.querySelector('.time'),
  date = document.querySelector('.date'),
  greeting = document.querySelector('.greeting'),
  yourName = document.querySelector('.name'),
  slideNext = document.querySelector('.slide-next'),
  slidePrev = document.querySelector('.slide-prev'),
  weatherIcon = document.querySelector('.weather-icon'),
  weatherDescription = document.querySelector('.weather-description'),
  wind = document.querySelector('.wind'),
  humidity = document.querySelector('.humidity'),
  temperature = document.querySelector('.temperature'),
  city = document.querySelector('.city'),
  weatherErr = document.querySelector('.weather-error'),
  quote = document.querySelector('.quote'),
  author = document.querySelector('.author'),
  changeQuote = document.querySelector('.change-quote'),
  play = document.querySelector('.play'),
  playPrev = document.querySelector('.play-prev'),
  playNext = document.querySelector('.play-next'),
  trackList = document.querySelector('.play-list');

let randomNum = 0,
  prevRandomNum = 0,
  randomNumber = getRandomNum(),
  isFlag = false,
  playNum = 0;

// 1. Часы и календарь
function showTime() {
  const currentTime = new Date().toLocaleTimeString('ru-RU');
  time.textContent = currentTime;
  
  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
}

function showDate() {
  const options = {
    'month': 'long',
    'day': 'numeric',
    'weekday': 'long',
  }
  const currentDate = new Date().toLocaleDateString('ru-RU', options);
  date.textContent = currentDate;
}

showTime();

// 2. Приветствие
function getTimeOfDay() {
  let currentHours = new Date().getHours();
  const timeOfDay = ['ночь', 'утро', 'день', 'вечер'];
  let timeIndex = Math.floor((currentHours % 24) / 6);

  return timeOfDay[timeIndex];
}

function showGreeting() {
  if (getTimeOfDay() === 'ночь') {
    greeting.textContent = `Доброй ${getTimeOfDay()}`;
  } else if (getTimeOfDay() === 'утро') {
    greeting.textContent = `Доброе ${getTimeOfDay()}`;
  } else if (getTimeOfDay() === 'день' || getTimeOfDay() === 'вечер') {
    greeting.textContent = `Добрый ${getTimeOfDay()}`;
  } else {
    greeting.textContent = `Произошла ошибка`;
  }
}

// Пользователь может ввести своё имя, которое будет отображаться на странице, даже после перезагрузки страницы
function setLocalStorage() {
  localStorage.setItem('name', yourName.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  const nameFromLS = localStorage.getItem('name');
  if (nameFromLS !== null) {
    yourName.value = nameFromLS;
  }
}

window.addEventListener('load', getLocalStorage);

// 3. Слайдер изображений
function getRandomNum(min = 1, max = 20) {
  randomNum = Math.floor(Math.random() * (max - min + 1) + min);
  while (randomNum == prevRandomNum) {
    randomNum = Math.floor(Math.random() * (max - min + 1) + min);
  }
  prevRandomNum = randomNum;
  return randomNum;
}

function setBag(random) {
  let timeOfDay = getTimeOfDay();

  switch (timeOfDay) {
    case 'ночь':
      timeOfDay = 'night';
      break;
    case 'утро':
      timeOfDay = 'morning';
      break;
    case 'день':
      timeOfDay = 'afternoon';
      break;
    default:
      timeOfDay = 'evening'
  }

  let bgNum = random;
  bgNum = bgNum.toString().padStart(2, '0');

  const url = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  const img = new Image();
  img.src = url;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${url})`;
  }
}

setBag(randomNumber);

// Перелистывание изображений по нажатию на стрелки
function getSlideNext() {
  ++randomNumber;
  if (randomNumber > 20) {
    randomNumber = 1;
  }
  setBag(randomNumber);
  console.log(`следующий слайд ${randomNumber}`);
}

function getSlidePrev() {
  randomNumber -= 1;
  if (randomNumber < 1) {
    randomNumber = 20;
  }
  setBag(randomNumber);
  console.log(`предыдущий слайд ${randomNumber}`);
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);


// 4. Виджет погоды
async function getWeather() {
  try {
    weatherErr.textContent = '';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value || getLS()}&lang=ru&appid=027d67b968453a2d261a28165e52007f&units=metric`;
    let res = await fetch(url);
    let data = await res.json();

    weatherIcon.className = 'weather-icon owf'
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${data.wind.speed} м/с`;
    humidity.textContent = `${data.main.humidity}%`;
  } catch(e) {
    console.log(e);
    temperature.textContent = '';
    weatherDescription.textContent = '';
    weatherErr.textContent = 'Ооу, произошла ошибка. Проверьте правильность набранного вами города';
  }

}

// Погода для определённого города
function setWeather(event) {
  if (event.code === 'Enter') {
    city.addEventListener('change', getWeather);
    city.blur();
  }
}

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setWeather);

// Localstorage для поля ввода города
function setLS() {
  localStorage.setItem('city', city.value);
}

window.addEventListener('beforeunload', setLS)

function getLS() {
  let cityName = localStorage.getItem('city');
  if (cityName !== null) {
    city.value = cityName;
  }
  return cityName;
}

window.addEventListener('load', getLS);

// 5. Виджет "цитата дня"
async function getQuotes() {
  const quotes = '../assets/data/db.json';
  const res = await fetch(quotes);
  const data = await res.json();

  return data;
}

// Функция показа цитаты на странице
function showQuote() {
  let random = getRandomNum(0, 2);

  getQuotes()
    .then(data => [data[random].text, data[random].author])
    .then(data => {
      quote.textContent = data[0];
      author.textContent = data[1];
    });
}

showQuote();

// Слушатель события по кнопке которая при нажатии на неё покажет случайную цитату
changeQuote.addEventListener('click', showQuote);

// 6. Аудиоплеер
// Объединение проигрывания и остановки звука в одной функции.
let audio = new Audio();

function playAudio() {
  audio.src = playList[playNum].src;
  if (!isFlag) {
    audio.play();
    toggleBtn();
    isFlag = true;
  } else {
    audio.pause();
    toggleBtn();
    isFlag = false;
  }
}

// Переключение play/pause
function toggleBtn() {
  if (!isFlag) {
    play.classList.add('pause');
  } else {
    play.classList.remove('pause');
  }
}

// Функции воспроизведения следующего/предыдущего аудио
function playNextAudio() {
  ++playNum;
  if (playNum > playList.length - 1) {
    playNum = 0;
  }
  isFlag = false;
  playAudio()
}

function playPrevAudio() {
  --playNum;
  if (playNum < 0) {
    playNum = playList.length - 1;
  }
  isFlag = false;
  playAudio()
}

play.addEventListener('click', playAudio);
playNext.addEventListener('click', playNextAudio);
playPrev.addEventListener('click', playPrevAudio);


// Плейлист на странице создаётся средствами JavaScript
playList.forEach((el, i) => {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.textContent = playList[i].title;
  trackList.append(li);
});

