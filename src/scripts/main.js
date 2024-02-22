'use strict';

const TELEGRAM_TOKEN = '6358692702:AAGKNgjxrpnT-M-gE2YpNyM6BDBXrJX737s';
const TELEGRAM_CHAT_ID = '761423783';
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

const form = document.querySelector('.form');
const nameInput = document.querySelector('.name');
const phoneInput = document.querySelector('.phone');
const messageTextarea = document.querySelector('.message');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  if (validateForm() && canSubmitForm()) {
    const name = nameInput.value || '';
    const phone = phoneInput.value || '';
    const message = messageTextarea.value || '';

    const data = getFormData(name, phone, message);

    fetchData(TELEGRAM_URL, 'POST', data, (error, reqData) => {
      if (reqData) {
        showModal(`Все ок, скоро ми з вами зв'яжемось`, '#4CAF50');
        setLastSubmissionTime();
      } else {
        showModal('Щось пішло не так, спробуйте знову', 'red');
        console.error(error);
      }
    });
  }
});

function validateForm() {
  const name = nameInput.value;
  const phone = phoneInput.value;

  if (!validator.matches(name, /^[\p{L}\s'-]+$/u)) {
    showModal("Введіть правильне ім'я", 'red');

    return false;
  }

  if (!validator.isMobilePhone(phone, 'any', { strictMode: true })) {
    showModal('Введіть номер телефону в форматі: +380671234567', 'red');

    return false;
  }

  return true;
}

function canSubmitForm() {
  const lastSubmissionTime = localStorage.getItem('lastSubmissionTime');
  const twentyFourHoursInMilliseconds = 15 * 60 * 1000;
  const currentTime = new Date().getTime();

  if (
    !lastSubmissionTime ||
    currentTime - lastSubmissionTime >= twentyFourHoursInMilliseconds
  ) {
    return true;
  } else {
    alert('Ви можете відправляти форму лише один раз за 15 хвилин.');

    return false;
  }
}

function setLastSubmissionTime() {
  localStorage.setItem('lastSubmissionTime', new Date().getTime());
}

function getFormData(name, phone, message) {
  const data = {
    chat_id: TELEGRAM_CHAT_ID,
    text: `Имя: ${name}\nТелефон: ${phone}\nСообщение: ${message}`,
  };

  return JSON.stringify(data);
}

function fetchData(url, method, data, callback) {
  const xhr = new XMLHttpRequest();

  xhr.open(method, url, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);

        callback(null, responseData);
      } else {
        callback(xhr.statusText);
      }
    }
  };

  xhr.onerror = function () {
    callback('Network error');
  };

  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send(data);
}

function showModal(modalMessage, color = '#4CAF50') {
  const notification = document.createElement('div');

  notification.style.backgroundColor = color;
  notification.className = 'notification';
  notification.textContent = modalMessage;

  document.body.appendChild(notification);

  if (color !== 'red') {
    document.querySelector('form').reset();
  }

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 5000);
}
