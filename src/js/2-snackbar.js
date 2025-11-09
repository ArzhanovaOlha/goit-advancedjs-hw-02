const form = document.querySelector(".form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const delay = Number(form.delay.value.trim());
  const state = form.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      state === "fulfilled" ? resolve(delay) : reject(delay);
    }, delay);
  });

  promise
    .then((ms) => {
      iziToast.success({
        title: "Success",
        message: `✅ Fulfilled promise in ${ms}ms`,
        position: "topRight",
      });
    })
    .catch((ms) => {
      iziToast.error({
        title: "Error",
        message: `❌ Rejected promise in ${ms}ms`,
        position: "topRight",
      });
    });

  form.reset();
});
