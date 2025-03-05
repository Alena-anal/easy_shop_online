'use strict';


const route = '/submit'
const SERVER_URL = `https://telegram-sender-server.vercel.app${route}`;
// const SERVER_URL = `http://localhost:3000${route}`;
const CHAT_ID = "761423783";

const form = document.querySelector('.form');
const nameInput = document.querySelector('.name');
const phoneInput = document.querySelector('.phone');
const messageTextarea = document.querySelector('.message');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  if (validateForm()) {
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

  if (!validator.isMobilePhone(phone, 'any', {strictMode: true})) {
    showModal('Введіть номер телефону в форматі: +380671234567', 'red');

    return false;
  }

  return true;
}


function getFormData(name, phone, message) {
  const data = {
    name: name,
    phone: phone,
    message: message,
    chatId: CHAT_ID,
  };

  return JSON.stringify(data);
}

async function fetchData(url, method, data) {
  try {
    const sessionToken = localStorage.getItem('sessionToken') || ''; // Получаем токен из localStorage
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Token': sessionToken // Отправляем токен в заголовке
      },
      body: data
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      if (result.sessionToken) {
        localStorage.setItem('sessionToken', result.sessionToken); // Сохраняем новый токен
      }
      window.location.href = result.redirectUrl;
      form.reset();
    } else {
      showModal(result.error || 'Щось пішло не так', 'red');
    }
  } catch (error) {
    showModal('Помилка підключення до сервера', 'red');
    console.error(error);
  }
}


function showModal(modalMessage, color = 'black') {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.style.color = color;
  notification.textContent = modalMessage;
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 5000);
}
