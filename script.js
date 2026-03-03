/* ========================================
   script.js — MD Ratul Hossen Portfolio
   ======================================== */

// ── PARTICLE CANVAS ──
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x      = Math.random() * canvas.width;
    this.y      = Math.random() * canvas.height;
    this.size   = Math.random() * 1.8 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    const palette = ['124,58,237', '59,130,246', '6,182,212'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200);
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

let animId;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animId = requestAnimationFrame(animate);
}

initParticles();
animate();

// Pause particle animation when hero is not visible (performance)
const heroSection = document.getElementById('hero');
const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { if (!animId) animate(); }
  else { cancelAnimationFrame(animId); animId = null; }
}, { threshold: 0 });
heroObserver.observe(heroSection);


// ── TYPEWRITER ──
const roles = [
  'Aspiring AI Researcher',
  'LLM Enthusiast',
  'Python Developer',
  'Data-Driven Problem Solver',
  'Transformer Architecture Learner',
  'Computer Science Student'
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typeEl = document.getElementById('typewriterText');

function typeWriter() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typeEl.textContent = current.substring(0, charIndex--);
  } else {
    typeEl.textContent = current.substring(0, charIndex++);
  }
  let delay = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length + 1) {
    delay = 2000; isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 400;
  }
  setTimeout(typeWriter, delay);
}
typeWriter();


// ── NAVBAR ──
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightNavLink();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}


// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── SKILL BAR ANIMATION ──
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const target = bar.getAttribute('data-width');
        bar.style.width = target + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(group => skillObserver.observe(group));


// ── CONTACT FORM ──
function handleFormSubmit(e) {
  e.preventDefault();
  const btn     = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnIcon = document.getElementById('btnIcon');
  const note    = document.getElementById('formNote');

  btn.disabled = true;
  btnText.textContent = 'Sending…';
  btnIcon.textContent = '⏳';

  // Build mailto link as a graceful fallback (no backend needed for static site)
  const name    = document.getElementById('contactName').value;
  const email   = document.getElementById('contactEmail').value;
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value;

  const mailtoUrl = `mailto:251-15-596@diu.edu.bd?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

  setTimeout(() => {
    window.open(mailtoUrl);
    btnText.textContent = 'Message Sent!';
    btnIcon.textContent = '✅';
    note.textContent    = 'Your email client has opened. Thank you for reaching out!';
    note.style.color    = 'var(--accent-cyan)';
    document.getElementById('contactForm').reset();
    setTimeout(() => {
      btn.disabled        = false;
      btnText.textContent = 'Send Message';
      btnIcon.textContent = '✉️';
      note.textContent    = '';
    }, 5000);
  }, 800);
}


// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// ── BACK TO TOP ON LOGO CLICK ──
document.querySelector('.footer-logo')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
