import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector("button[data-start]");
const dateTimePicker = document.querySelector("#datetime-picker");
const daysSpan = document.querySelector("[data-days]");
const hoursSpan = document.querySelector("[data-hours]");
const minutesSpan = document.querySelector("[data-minutes]");
const secondsSpan = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerInterval = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        if (userSelectedDate <= new Date()) {
            iziToast.error({
                title: 'Error',
                message: 'Будь-ласка, виберіть дату з майбутнього',
            });
            startButton.disabled = true;
        } else {
            startButton.disabled = false;
        }
    },
};

flatpickr(dateTimePicker, options);

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return value < 10 ? '0' + value : value;
}

function updateTimer({ days, hours, minutes, seconds }) {
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
}

function startCountdown(endDate) {
    timerInterval = setInterval(() => {
        const now = new Date();
        const timeDifference = endDate - now;

        if (timeDifference <= 0) {
            clearInterval(timerInterval);
            updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            iziToast.success({
                title: 'Success',
                message: 'Countdown completed!',
            });
            dateTimePicker.disabled = false;
            startButton.disabled = true;
            return;
        }

        const timeRemaining = convertMs(timeDifference);
        updateTimer(timeRemaining);
    }, 1000);
}

startButton.addEventListener('click', () => {
    if (userSelectedDate) {
        startCountdown(userSelectedDate);
        dateTimePicker.disabled = true;
        startButton.disabled = true;
    }
});
