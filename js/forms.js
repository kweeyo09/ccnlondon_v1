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

  // Each subject goes to the matching CCN inbox
  const inboxes = {
    general: 'ccnlondon2025@gmail.com',
    client: 'ccnlondonclients@gmail.com',
    partnership: 'ccnlondonexternal@gmail.com',
    recruiting: 'ccnlondonrecruiting@gmail.com',
    other: 'ccnlondon2025@gmail.com',
  };

  const status = form.querySelector('#form-status');

  const showStatus = (to) => {
    status.className = 'form__status form__status--success';
    status.innerHTML = '';
    status.append(
      'Your email app should now open with your message ready to send. If nothing happened, email us directly at ',
      Object.assign(document.createElement('a'), { href: `mailto:${to}`, textContent: to }),
      '.'
    );
  };

  // Validate on submit, then open the visitor's email app with the message filled in
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    fields.forEach((field) => {
      const isValid = field.validate(field.input.value);
      setError(field, !isValid);
      if (!isValid) hasError = true;
    });

    if (hasError) {
      // Focus first invalid field
      const firstError = fields.find((f) => !f.validate(f.input.value));
      firstError?.input.focus();
      return;
    }

    const [name, email, subject, message] = fields.map((f) => f.input.value.trim());
    const subjectLabel = form.querySelector('#subject').selectedOptions[0].textContent;
    const to = inboxes[subject] || inboxes.general;

    const mailSubject = `${subjectLabel} — ${name}`;
    const mailBody = `${message}\n\n—\n${name}\n${email}`;

    window.location.href =
      `mailto:${to}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    showStatus(to);
  });
})();
