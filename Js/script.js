document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  const applyScrollState = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', applyScrollState);
  applyScrollState();

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      document.querySelector(link.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
      // close menu if open (mobile)
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Toggle nav
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Simple slider for blog feature
  const slider = document.querySelector('[data-slider]');
  if (slider) {
    const track = slider.querySelector('.sf-track');
    const slides = Array.from(track.children);
    const nav = slider.querySelector('.sf-nav');
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => goTo(i));
      nav.appendChild(b);
    });
    let index = 0;
    let timer;
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      nav.querySelectorAll('button').forEach((b, bi) => b.classList.toggle('active', bi === index));
      restart();
    }
    function next() { goTo(index + 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, 6000); }
    restart();
    window.addEventListener('visibilitychange', () => { if (document.hidden) clearInterval(timer); else restart(); });
  }

  // Mega menu toggle (shared)
  const megaTrigger = document.querySelector('.mega-trigger');
  const megaMenu = document.querySelector('.mega-menu');
  if (megaTrigger && megaMenu) {
    let hoverTimer;
    const parentLi = megaTrigger.closest('.has-mega');
    const openMega = () => { megaMenu.classList.add('open'); megaTrigger.setAttribute('aria-expanded', 'true'); };
    const closeMega = () => { megaMenu.classList.remove('open'); megaTrigger.setAttribute('aria-expanded', 'false'); };

    // Desktop hover intent
    parentLi.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(openMega, 110);
    });
    parentLi.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(closeMega, 140);
    });

    // Click / keyboard toggle (mobile & accessibility)
    megaTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      megaMenu.classList.toggle('open');
      const isOpen = megaMenu.classList.contains('open');
      megaTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!parentLi.contains(e.target) && megaMenu.classList.contains('open')) {
        closeMega();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && megaMenu.classList.contains('open')) {
        closeMega();
        megaTrigger.focus();
      }
    });

    // Basic focus management: close when tabbing away
    const focusable = megaMenu.querySelectorAll('a');
    focusable[focusable.length - 1]?.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey) { closeMega(); }
    });
  }
});
