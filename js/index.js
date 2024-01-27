'use strict';
// Глобальные переменные
const time = document.querySelector('.time'),
  date = document.querySelector('.date'),
  greeting = document.querySelector('.greeting'),
  yourName = document.querySelector('.name');

let randomNum = 0,
  prevRandomNum = 0;

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

function setBag() {
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

  let bgNum = getRandomNum();
  bgNum = bgNum.toString().padStart(2, '0');

  document.body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`;
}

setBag();