import Notiflix from 'notiflix';

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

document.querySelector('.form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const delayInput = document.querySelector('input[name="delay"]');
  const stepInput = document.querySelector('input[name="step"]');
  const amountInput = document.querySelector('input[name="amount"]');

  const delay = Number(delayInput.value);
  const step = Number(stepInput.value);
  const amount = Number(amountInput.value);

  delayInput.value = '';
  stepInput.value = '';
  amountInput.value = '';

  let currentDelay = delay;

  const handlePromise = async (position, delay) => {
    try {
      const result = await createPromise(position, delay);
      Notiflix.Notify.success(`✅ Fulfilled promise ${result.position} in ${result.delay}ms`);
    } catch (error) {
      Notiflix.Notify.failure(`❌ Rejected promise ${error.position} in ${error.delay}ms`);
    }
  };

  const promises = [];

  if (step === 0) {
    for (let i = 1; i <= amount; i++) {
      promises.push(handlePromise(i, delay));
    }
  } else {
    for (let i = 1; i <= amount; i++) {
      promises.push(handlePromise(i, currentDelay));
      currentDelay += step;
    }
  }

  await Promise.all(promises);
});