// ============================================================
// CIELSKO — MAIN JAVASCRIPT
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── STICKY HEADER ──
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ── MOBILE HAMBURGER ──
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      hamburger.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Hamburger animation
  const style = document.createElement('style');
  style.textContent = `
    .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.active span:nth-child(2) { opacity: 0; transform: translateX(-10px); }
    .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
  `;
  document.head.appendChild(style);

  // ── BACK TO TOP ──
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── COOKIE BANNER ──
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookies');
  const declineBtn = document.getElementById('declineCookies');

  if (cookieBanner && !localStorage.getItem('cielsko_cookies')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1500);
  }
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cielsko_cookies', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cielsko_cookies', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // ── TESTIMONIALS SLIDER ──
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dotsContainer = document.getElementById('testimonialsDots');

  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    let perView = getPerView();
    let maxSlide = Math.max(0, cards.length - perView);
    let autoplay;

    function getPerView() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const total = Math.ceil(cards.length / getPerView());
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonials-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      const p = getPerView();
      const idx = Math.floor(current / p);
      dotsContainer.querySelectorAll('.testimonials-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    }

    function goTo(slideIdx) {
      const p = getPerView();
      current = Math.min(slideIdx * p, Math.max(0, cards.length - p));
      const cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      updateDots();
    }

    function next() {
      const p = getPerView();
      current = current + p >= cards.length ? 0 : current + p;
      const cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      updateDots();
    }

    function prev() {
      const p = getPerView();
      current = current - p < 0 ? Math.max(0, cards.length - p) : current - p;
      const cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      updateDots();
    }

    nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
    prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

    function startAutoplay() {
      autoplay = setInterval(next, 4500);
    }
    function resetAutoplay() {
      clearInterval(autoplay);
      startAutoplay();
    }

    // Touch/swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAutoplay(); }
    });

    buildDots();
    startAutoplay();

    window.addEventListener('resize', () => {
      current = 0;
      perView = getPerView();
      maxSlide = Math.max(0, cards.length - perView);
      track.style.transform = 'translateX(0)';
      buildDots();
    });
  }

  // ── FADE-IN ON SCROLL ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.product-card, .why-card, .blog-card, .cert-card, .principle-card, .team-card, .stat-box')
    .forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });

  // ── COUNTER ANIMATION ──
  const counters = document.querySelectorAll('.hero__stat-num, .stat-box__num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const text = el.textContent;
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.]/g, '');
    if (isNaN(num)) return;
    let start = 0;
    const duration = 1800;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (num < 10 ? Math.floor(eased * num * 10) / 10 : Math.floor(eased * num)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

});
