/* ============================================================
   CCN London — Contact Form Validation
   ============================================================ */

(() => {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fields = [
    {
      input: form.querySelector('#name'),
      error: form.querySelector('#name-error'),
      validate: (val) => val.trim().length > 0,
    },
    {
      input: form.querySelector('#email'),
      error: form.querySelector('#email-error'),
      validate: (val) => emailRegex.test(val.trim()),
    },
    {
      input: form.querySelector('#subject'),
      error: form.querySelector('#subject-error'),
      validate: (val) => val.length > 0,
    },
    {
      input: form.querySelector('#message'),
      error: form.querySelector('#message-error'),
      validate: (val) => val.trim().length > 0,
    },
  ];

  const setError = (field, show) => {
    const group = field.input.closest('.form__group');
    group.classList.toggle('form__group--error', show);
    field.input.classList.toggle('form__input--error', show);
    field.input.classList.toggle('form__select--error', show);
    field.input.classList.toggle('form__textarea--error', show);
  };

  // Validate on blur
  fields.forEach((field) => {
    field.input.addEventListener('blur', () => {
      setError(field, !field.validate(field.input.value));
    });

    // Clear error on input
    field.input.addEventListener('input', () => {
      if (field.validate(field.input.value)) {
        setError(field, false);
      }
    });
  });

  // Validate on submit
  form.addEventListener('submit', (e) => {
    let hasError = false;

    fields.forEach((field) => {
      const isValid = field.validate(field.input.value);
      setError(field, !isValid);
      if (!isValid) hasError = true;
    });

    if (hasError) {
      e.preventDefault();
      // Focus first invalid field
      const firstError = fields.find((f) => !f.validate(f.input.value));
      firstError?.input.focus();
    }
  });
})();
