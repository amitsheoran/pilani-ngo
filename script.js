document.addEventListener('DOMContentLoaded', () => {
  /* ── Mobile Nav ──────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mainNav.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('show');
      document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });
    if (navOverlay) navOverlay.addEventListener('click', () => { hamburger.classList.remove('active'); mainNav.classList.remove('open'); navOverlay.classList.remove('show'); document.body.style.overflow = ''; });
    mainNav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => { hamburger.classList.remove('active'); mainNav.classList.remove('open'); if (navOverlay) navOverlay.classList.remove('show'); document.body.style.overflow = ''; }));
  }

  /* ── Header Scroll ───────────────────── */
  const header = document.querySelector('.site-header');
  if (header) window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));

  /* ── Active Nav Link ─────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a:not(.btn)').forEach(l => {
    const h = l.getAttribute('href');
    if (h === page || (page === '' && h === 'index.html')) l.classList.add('active');
  });

  /* ── Scroll Animations ───────────────── */
  const fadeEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (fadeEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => obs.observe(el));
  }

  /* ── Counter Animation ───────────────── */
  document.querySelectorAll('.impact-number, .stat-number').forEach(el => {
    const target = parseInt(el.textContent.replace(/[^0-9]/g, ''));
    const suffix = el.textContent.replace(/[0-9,]/g, '');
    if (isNaN(target)) return;
    let current = 0;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const step = Math.max(1, Math.floor(target / 60));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current.toLocaleString() + suffix;
          }, 25);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  /* ── Lightbox ────────────────────────── */
  const lightbox = document.querySelector('.lightbox');
  const lbImg = document.querySelector('.lightbox img');
  const lbClose = document.querySelector('.lightbox-close');
  const lbPrev = document.querySelector('.lightbox-prev');
  const lbNext = document.querySelector('.lightbox-next');
  const items = document.querySelectorAll('.gallery-item');
  let idx = 0;
  if (lightbox && items.length) {
    items.forEach((item, i) => item.addEventListener('click', () => { idx = i; lbImg.src = item.querySelector('img').src; lightbox.classList.add('active'); document.body.style.overflow = 'hidden'; }));
    const close = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
    if (lbClose) lbClose.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    const show = i => { lbImg.src = items[i].querySelector('img').src; };
    if (lbPrev) lbPrev.addEventListener('click', e => { e.stopPropagation(); idx = (idx - 1 + items.length) % items.length; show(idx); });
    if (lbNext) lbNext.addEventListener('click', e => { e.stopPropagation(); idx = (idx + 1) % items.length; show(idx); });
    document.addEventListener('keydown', e => { if (!lightbox.classList.contains('active')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') { idx = (idx - 1 + items.length) % items.length; show(idx); } if (e.key === 'ArrowRight') { idx = (idx + 1) % items.length; show(idx); } });
  }

  /* ── Contact Form → WhatsApp ─────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      const v = (id, test) => {
        const el = form.querySelector('#' + id);
        if (!test(el.value.trim())) { el.closest('.form-group').classList.add('error'); ok = false; }
      };

      v('name', s => s.length >= 2);
      v('email', s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
      v('phone', s => /^[\d\s+\-()]{10,15}$/.test(s));
      v('message', s => s.length >= 10);

      if (ok) {
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const phone = form.querySelector('#phone').value.trim();
        const interest = form.querySelector('#interest') ? form.querySelector('#interest').value : 'Not specified';
        const message = form.querySelector('#message').value.trim();

        const waMsg = encodeURIComponent(
          'Hello Pilani NGO!\n' +
          'I\'d like to connect with you.\n\n' +
          '-----------------------------------\n' +
          'Name: ' + name + '\n' +
          'Email: ' + email + '\n' +
          'Phone: ' + phone + '\n' +
          'Interest: ' + (interest || 'Not specified') + '\n' +
          'Message: ' + message + '\n' +
          '-----------------------------------\n\n' +
          'Looking forward to hearing from you!\n' +
          'Via: pilani-ngo.com'
        );

        window.open('https://wa.me/919991135395?text=' + waMsg, '_blank');
      }
    });
  }
});
