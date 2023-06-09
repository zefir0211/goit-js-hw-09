import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    const startButton = document.querySelector("[data-start]");

    if (selectedDate <= currentDate) {
      startButton.setAttribute("disabled", true);
      Notiflix.Notify.failure("Please choose a date in the future");
    } else {
      startButton.removeAttribute("disabled");
    }
  },
};


const startButton = document.querySelector("[data-start]");
startButton.setAttribute("disabled", true);

flatpickr("#datetime-picker", options);

const daysElement = document.querySelector("[data-days]");
const hoursElement = document.querySelector("[data-hours]");
const minutesElement = document.querySelector("[data-minutes]");
const secondsElement = document.querySelector("[data-seconds]");

let intervalId = null;

startButton.addEventListener("click", startTimer);

function startTimer() {
  startButton.setAttribute("disabled", true);
  const selectedDate = flatpickr.parseDate(document.querySelector("#datetime-picker").value, "Y-m-d H:i:S");
  
  clearInterval(intervalId);
  intervalId = setInterval(updateTimer, 1000);

  updateTimer();

  function updateTimer() {
    const currentDate = new Date();
    const timeDiff = selectedDate - currentDate;

    if (timeDiff <= 0) {
      clearInterval(intervalId);
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";
      Notiflix.Notify.success("Countdown completed!");
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDiff);

    daysElement.textContent = addLeadingZero(days);
    hoursElement.textContent = addLeadingZero(hours);
    minutesElement.textContent = addLeadingZero(minutes);
    secondsElement.textContent = addLeadingZero(seconds);
  }
}

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
  return value.toString().padStart(2, "0");
}