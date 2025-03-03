'use strict';


const SERVER_URL = `https://telegram-sender-server.vercel.app/submit`;
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

  if (!validator.isMobilePhone(phone, 'any', { strictMode: true })) {
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
    grecaptcha.ready(async () => {
      const token = await grecaptcha.execute('6LehoOgqAAAAALZnjBtZSX9S9j5m8TQb68677WbS', { action: 'submit' });
      data = { ...JSON.parse(data), recaptchaToken: token };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        sessionStorage.setItem('formSubmitted', 'true');
        window.location.href = 'result.html';
        form.reset();
      } else {
        showModal("Щось пішло не так");
      }

    });
  } catch (error) {
    console.error(error);
  }
}



function showModal(modalMessage) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = modalMessage;
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 5000);
}
