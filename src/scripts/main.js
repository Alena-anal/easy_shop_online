'use strict';

const SERVER_URL = `http://localhost:3000/submit`;

const form = document.querySelector('.form');
const nameInput = document.querySelector('.name');
const phoneInput = document.querySelector('.phone');
const messageTextarea = document.querySelector('.message');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  if (validateForm() && canSubmitForm()) {
    const name = nameInput.value || '';
    const phone = phoneInput.value || '';
    const message = messageTextarea.value || '';

    const data = getFormData(name, phone, message);
    await fetchData(SERVER_URL, 'POST', data);
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
    name: name,
    phone: phone,
    message: message,
  };

  return JSON.stringify(data);
}

async function fetchData(url, method, data) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });

    if (response.status === 200) {
      showModal("Все ок, скоро ми з вами зв'яжемось", '#4CAF50');
      setLastSubmissionTime();
    } else {
      showModal('Щось пішло не так, спробуйте знову', 'red');
    }
  } catch (error) {
    console.error(error);
  }
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
