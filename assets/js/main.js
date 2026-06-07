/* ═══════════════════════════════════════════════════════════
   Advocate Pallavi Srivastava — main.js
   • Navbar scroll effect
   • Hamburger menu
   • Scroll-reveal (IntersectionObserver)
   • Counter animation (hero stats)
   • EmailJS contact form
   • Footer year
═══════════════════════════════════════════════════════════ */

// ── Footer year ──────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Navbar scroll effect ─────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Hamburger menu ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Scroll-reveal ────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);   // animate once
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Counter animation ────────────────────────────────────
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    // ease-out-quart
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ── Smooth scroll for anchor links ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── EmailJS Contact Form ─────────────────────────────────
/*
  TO ACTIVATE:
  1. Create a free account at https://www.emailjs.com
  2. Add a service connected to advocatepallavi.s@gmail.com
  3. Create an email template with these variables:
       {{from_name}}, {{from_email}}, {{phone}}, {{practice_area}}, {{message}}
  4. Replace the three placeholders below with your real IDs.
*/
const EMAILJS_PUBLIC_KEY  = 'R-RnXFVKjzcf9tCuy';
const EMAILJS_SERVICE_ID  = 'service_kfu6za9';
const EMAILJS_TEMPLATE_ID = 'template_rvtb2rn';

emailjs.init(EMAILJS_PUBLIC_KEY);

const form       = document.getElementById('contactForm');
const btnText    = document.getElementById('btnText');
const btnLoader  = document.getElementById('btnLoader');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Hide previous messages
  formSuccess.classList.add('hidden');
  formError.classList.add('hidden');

  // Basic validation
  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const phone   = form.phone.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !phone || !message) {
    formError.textContent = '❌ Please fill in all required fields.';
    formError.classList.remove('hidden');
    return;
  }

  // Loading state
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  submitBtn.disabled = true;

  const templateParams = {
    from_name:     name,
    from_email:    email,
    phone:         phone,
    practice_area: form.practice_area.value || 'Not specified',
    message:       message,
    reply_to:      email,
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    formSuccess.classList.remove('hidden');
    form.reset();
  } catch (err) {
    console.error('EmailJS error:', err);
    formError.textContent = '❌ Something went wrong. Please email directly at advocatepallavi.s@gmail.com';
    formError.classList.remove('hidden');
  } finally {
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
    submitBtn.disabled = false;
  }
});
