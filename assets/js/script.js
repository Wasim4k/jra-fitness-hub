/* =========================================================
   JRA FITNESS HUB — MAIN SCRIPT
   Vanilla JS + GSAP + AOS + Swiper
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Loading Screen ---------------- */
  const loader = document.getElementById('loader');
  const loaderBar = document.querySelector('.loader-bar i');
  if (loader) {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) { p = 100; clearInterval(interval); }
      if (loaderBar) loaderBar.style.width = p + '%';
    }, 120);
    window.addEventListener('load', () => {
      setTimeout(() => { loader.classList.add('hide'); }, 500);
    });
    // safety fallback in case load event is slow
    setTimeout(() => loader.classList.add('hide'), 2600);
  }

  /* ---------------- AOS Init ---------------- */
  if (window.AOS) {
    AOS.init({
      duration: 550,
      once: true,
      easing: 'ease-out-cubic',
      offset: 120,
      anchorPlacement: 'top-bottom'
    });
  }

  /* ---------------- Custom Cursor Follower ---------------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    function loopCursor() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loopCursor);
    }
    loopCursor();
    document.querySelectorAll('a, button, .hover-grow').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width = '54px'; ring.style.height = '54px'; ring.style.opacity = '.6'; });
      el.addEventListener('mouseleave', () => { ring.style.width = '34px'; ring.style.height = '34px'; ring.style.opacity = '1'; });
    });
  }

  /* ---------------- Sticky Navbar Blur on Scroll ---------------- */
  const navbar = document.querySelector('.navbar');
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  /* ---------------- Back To Top ---------------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------- Counter Animation ---------------- */
  const counters = document.querySelectorAll('.counter-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- Typing Effect ---------------- */
  const typeEl = document.querySelector('.typing-text');
  if (typeEl) {
    const words = JSON.parse(typeEl.getAttribute('data-words') || '["TRANSFORM"]');
    let wi = 0, ci = 0, deleting = false;
    function typeLoop() {
      const word = words[wi];
      if (!deleting) {
        ci++;
        typeEl.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
      } else {
        ci--;
        typeEl.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(typeLoop, deleting ? 55 : 95);
    }
    typeLoop();
  }

  /* ---------------- Particle Canvas (Hero) ---------------- */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    function initParticles() {
      particles = [];
      const count = window.innerWidth < 768 ? 35 : 70;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 0.6,
          vy: -(Math.random() * 0.5 + 0.15),
          vx: (Math.random() - 0.5) * 0.3,
          o: Math.random() * 0.6 + 0.2
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,122,0,${p.o})`;
        ctx.shadowColor = 'rgba(255,122,0,0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize(); initParticles(); draw();
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }

  /* ---------------- GSAP Animations ---------------- */
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger || {});

    // Hero visual floating
    gsap.to('.hero-visual', {
      y: -18, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });

    // Hero stat floats - gentle drift
    document.querySelectorAll('.stat-float').forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 === 0 ? -14 : 14,
        duration: 3 + i * 0.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2
      });
    });

    // Hero heading entrance
    gsap.from('.hero-title', { opacity: 0, y: 40, duration: 1, ease: 'power3.out', delay: .3 });
    gsap.from('.hero-desc, .hero-btns', { opacity: 0, y: 24, duration: 1, ease: 'power3.out', delay: .55, stagger: .1 });
    gsap.from('.hero-visual', { opacity: 0, scale: .85, duration: 1.1, ease: 'power3.out', delay: .4 });

    // Cards fade/rotate/lift on scroll — skip elements already handled by AOS
    // (having both caused a conflict where content appeared late/jerky on scroll)
    if (window.ScrollTrigger) {
      gsap.utils.toArray('.gsap-card:not([data-aos])').forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40, rotate: 0 },
          {
            opacity: 1, y: 0, rotate: 0, duration: .5, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 92%' }
          }
        );
      });

      // Navbar blur handled by scroll listener already; parallax for about media
      gsap.utils.toArray('.parallax-slow').forEach((el) => {
        gsap.to(el, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    }

    // Magnetic buttons
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.35, duration: .3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: .4, ease: 'elastic.out(1,0.4)' });
      });
    });

    // Mouse parallax on hero visual
    const heroSection = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    if (heroSection && heroVisual) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(heroVisual, { x: px * 24, y: py * 24, duration: .6, ease: 'power2.out' });
      });
    }
  }

  /* ---------------- Swiper: Testimonials ---------------- */
  if (window.Swiper && document.querySelector('.testimonial-swiper')) {
    new Swiper('.testimonial-swiper', {
      loop: true,
      autoplay: { delay: 4200, disableOnInteraction: false },
      spaceBetween: 26,
      pagination: { el: '.testimonial-swiper .swiper-pagination', clickable: true },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }
    });
  }

  /* ---------------- Swiper: Trainers (if used as slider) ---------------- */
  if (window.Swiper && document.querySelector('.trainers-swiper')) {
    new Swiper('.trainers-swiper', {
      loop: true,
      spaceBetween: 24,
      navigation: {
        nextEl: '.trainers-next',
        prevEl: '.trainers-prev'
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 4 }
      }
    });
  }

  /* ---------------- BMI Calculator ---------------- */
  const bmiForm = document.getElementById('bmiForm');
  if (bmiForm) {
    bmiForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const heightCm = parseFloat(document.getElementById('bmiHeight').value);
      const weightKg = parseFloat(document.getElementById('bmiWeight').value);
      if (!heightCm || !weightKg) return;
      const h = heightCm / 100;
      const bmi = weightKg / (h * h);
      const bmiRounded = Math.round(bmi * 10) / 10;

      document.getElementById('bmiNum').textContent = bmiRounded;

      let cat = '', color = '', pct = 0;
      if (bmi < 18.5) { cat = 'Underweight'; pct = 15; }
      else if (bmi < 25) { cat = 'Healthy Range'; pct = 45; }
      else if (bmi < 30) { cat = 'Overweight'; pct = 72; }
      else { cat = 'Obese'; pct = 92; }

      document.getElementById('bmiCat').textContent = cat;
      const bar = document.getElementById('bmiBar');
      bar.style.width = pct + '%';
    });
  }

  /* ---------------- Contact Form (demo submit) ---------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent';
      contactForm.reset();
      setTimeout(() => { btn.innerHTML = original; }, 2600);
    });
  }

  /* ---------------- Set active nav link ---------------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });

});
