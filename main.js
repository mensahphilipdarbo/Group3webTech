
// ---- NAVBAR HAMBURGER ----
(function () {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });

  // close on nav link click (mobile)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();




// ---- ACTIVE NAV LINK ----
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();


// ---- SCROLL-REVEAL (Intersection Observer) ----
(function () {
  const els = document.querySelectorAll('.card, .service-full-card, .info-card, .contact-item, .why-item');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationName = 'fadeInUp';
        entry.target.style.animationDuration = '0.55s';
        entry.target.style.animationFillMode = 'forwards';
        entry.target.style.opacity = '0';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
})();


// ---- APPOINTMENT FORM VALIDATION ----
(function () {
  const form = document.getElementById('apptForm');
  if (!form) return;

  function showError(input, msg) {
    input.classList.add('error');
    const errEl = input.parentElement.querySelector('.err-msg');
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
  }

  function clearError(input) {
    input.classList.remove('error');
    const errEl = input.parentElement.querySelector('.err-msg');
    if (errEl) errEl.style.display = 'none';
  }

  function validateField(input) {
    const val = input.value.trim();
    const type = input.type;
    const name = input.name;

    clearError(input);

    if (input.required && !val) {
      showError(input, 'This field is required.');
      return false;
    }

    if (type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showError(input, 'Please enter a valid email address.');
        return false;
      }
    }

    if (type === 'tel' && val) {
      const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
      if (!phoneRegex.test(val)) {
        showError(input, 'Please enter a valid phone number.');
        return false;
      }
    }

    if (name === 'dob' && val) {
      const dob = new Date(val);
      const today = new Date();
      if (dob >= today) {
        showError(input, 'Date of birth must be in the past.');
        return false;
      }
    }

    if (name === 'appt_date' && val) {
      const apptDate = new Date(val);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0,0,0,0);
      if (apptDate < tomorrow) {
        showError(input, 'Appointment must be at least tomorrow.');
        return false;
      }
    }

    return true;
  }

  // live validation
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (isValid) {
      form.style.display = 'none';
      const successMsg = document.getElementById('apptSuccess');
      if (successMsg) {
        successMsg.style.display = 'flex';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
})();


// ---- FEEDBACK FORM ----
(function () {
  const form = document.getElementById('feedbackForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = form.querySelector('#fb_name')?.value.trim();
    const msgVal  = form.querySelector('#fb_message')?.value.trim();
    const nameErr = form.querySelector('#fb_name_err');
    const msgErr  = form.querySelector('#fb_msg_err');
    let valid = true;

    if (!nameVal) {
      if (nameErr) { nameErr.style.display = 'block'; }
      form.querySelector('#fb_name').classList.add('error');
      valid = false;
    } else {
      if (nameErr) nameErr.style.display = 'none';
      form.querySelector('#fb_name').classList.remove('error');
    }

    if (!msgVal) {
      if (msgErr) msgErr.style.display = 'block';
      form.querySelector('#fb_message').classList.add('error');
      valid = false;
    } else {
      if (msgErr) msgErr.style.display = 'none';
      form.querySelector('#fb_message').classList.remove('error');
    }

    if (valid) {
      form.style.display = 'none';
      const successMsg = document.getElementById('feedbackSuccess');
      if (successMsg) {
        successMsg.style.display = 'flex';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
})();


// ---- SERVICE SEARCH (Services page) ----
(function () {
  const searchInput = document.getElementById('serviceSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.service-full-card').forEach(card => {
      const text = card.innerText.toLowerCase();
      card.parentElement.style.display = text.includes(query) ? '' : 'none';
    });

    const noResult = document.getElementById('noResult');
    const visible = [...document.querySelectorAll('.service-full-card')].some(c => c.parentElement.style.display !== 'none');
    if (noResult) noResult.style.display = visible ? 'none' : 'block';
  });
})();


// ---- CURRENT YEAR IN FOOTER ----
(function () {
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();