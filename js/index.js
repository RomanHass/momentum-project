'use strict';
// Глобальные переменные
const time = document.querySelector('.time'),
  date = document.querySelector('.date');

// 1. Часы и календарь
function showTime() {
  const currentTime = new Date().toLocaleTimeString('ru-RU');
  time.textContent = currentTime;
  
  showDate();
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