import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const startBtn = document.querySelector("[data-start]");
const stopBtn = document.querySelector("[data-stop]");
const dateInput = document.querySelector("#datetime-picker");

const daysRef = document.querySelector("[data-days]");
const hoursRef = document.querySelector("[data-hours]");
const minsRef = document.querySelector("[data-minutes]");
const secsRef = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;
stopBtn.disabled = true;

const fpInstance = flatpickr(dateInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    if (!picked || picked <= new Date()) {
      startBtn.disabled = true;
      iziToast.error({
        message: "Please choose a date in the future",
        position: "topRight",
      });
      return;
    }

    userSelectedDate = picked;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  },
});

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  dateInput.disabled = true;

  updateClock();
  timerId = setInterval(updateClock, 1000);
});

stopBtn.addEventListener("click", resetTimer);

function updateClock() {
  const diff = userSelectedDate - new Date();

  if (diff <= 0) {
    clearInterval(timerId);
    resetTimer();
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(diff);
  updateTimer({ days, hours, minutes, seconds });
}

function resetTimer() {
  clearInterval(timerId);

  updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  dateInput.disabled = false;
  startBtn.disabled = true;
  stopBtn.disabled = true;

  userSelectedDate = null;
  fpInstance.clear();
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysRef.textContent = days.toString().padStart(2, "0");
  hoursRef.textContent = hours.toString().padStart(2, "0");
  minsRef.textContent = minutes.toString().padStart(2, "0");
  secsRef.textContent = seconds.toString().padStart(2, "0");
}