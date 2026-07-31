/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SRI MADHURI MAKEOVERS — PREMIUM ANIMATION & INTERACTION ENGINE
 * ═══════════════════════════════════════════════════════════════════════════
 * Cinematic animations, smooth interactions, and premium UX.
 * All animations maintain 60 FPS via requestAnimationFrame.
 * ═══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════════════════════════════
     1. LOADING SCREEN
     ═══════════════════════════════════════════════════════════════════════ */
  const loader = document.getElementById('loader');
  const body = document.body;

  const dismissLoader = () => {
    if (loader) {
      loader.classList.add('hidden');
      body.classList.remove('loading');
      // Trigger hero animations after loader
      setTimeout(revealHeroContent, 300);
    }
  };

  // Dismiss loader after 2.5s or when page fully loads (whichever comes first after min time)
  const minLoadTime = 2000;
  const loadStart = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - loadStart;
    const remaining = Math.max(0, minLoadTime - elapsed);
    setTimeout(dismissLoader, remaining);
  });

  // Safety timeout in case load event already fired
  setTimeout(dismissLoader, 3500);


  /* ═══════════════════════════════════════════════════════════════════════
     2. HERO CONTENT REVEAL
     ═══════════════════════════════════════════════════════════════════════ */
  function revealHeroContent() {
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('visible');

    const elements = [
      { el: document.querySelector('.hero-label'), delay: 0 },
      { el: document.querySelector('.hero h1'), delay: 200 },
      { el: document.querySelector('.hero-subtitle'), delay: 400 },
      { el: document.querySelector('.hero-buttons'), delay: 600 },
    ];

    elements.forEach(({ el, delay }) => {
      if (el) {
        setTimeout(() => {
          el.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
      }
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════
     3. HERO PARTICLES
     ═══════════════════════════════════════════════════════════════════════ */
  const particlesContainer = document.getElementById('hero-particles');

  if (particlesContainer) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      const particleCount = window.innerWidth < 768 ? 15 : 30;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = (0.2 + Math.random() * 0.6).toString();
        particlesContainer.appendChild(particle);
      }
    }
  }


  /* ═══════════════════════════════════════════════════════════════════════
     4. NAVIGATION
     ═══════════════════════════════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navMenu = document.getElementById('nav-menu-list');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile menu toggle
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen.toString());

      if (isOpen) {
        icon.classList.replace('fa-bars', 'fa-times');
        body.style.overflow = 'hidden';
      } else {
        icon.classList.replace('fa-times', 'fa-bars');
        body.style.overflow = '';
      }
    });
  }

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('active');
      const icon = mobileMenuBtn?.querySelector('i');
      if (icon) {
        icon.classList.replace('fa-times', 'fa-bars');
      }
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
  });


  /* ═══════════════════════════════════════════════════════════════════════
     5. SCROLL HANDLER (Debounced)
     ═══════════════════════════════════════════════════════════════════════ */
  const scrollProgress = document.getElementById('scroll-progress');
  let scrollRAF;

  function handleScroll() {
    if (scrollRAF) return;
    scrollRAF = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Navbar scroll state
      if (navbar) {
        navbar.classList.toggle('scrolled', scrollY > 60);
      }

      // Scroll progress bar
      if (scrollProgress && docHeight > 0) {
        const progress = (scrollY / docHeight) * 100;
        scrollProgress.style.width = progress + '%';
      }

      // Active nav link
      updateActiveNavLink();

      scrollRAF = null;
    });
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    let currentId = '';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        link.classList.toggle('active', href === '#' + currentId);
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ═══════════════════════════════════════════════════════════════════════
     6. CURSOR GLOW (Desktop only)
     ═══════════════════════════════════════════════════════════════════════ */
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorGlow && window.innerWidth > 768) {
    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    function animateCursor() {
      glowX += (cursorX - glowX) * 0.08;
      glowY += (cursorY - glowY) * 0.08;
      cursorGlow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
      requestAnimationFrame(animateCursor);
    }

    animateCursor();
  }


  /* ═══════════════════════════════════════════════════════════════════════
     7. SCROLL REVEAL (Intersection Observer)
     ═══════════════════════════════════════════════════════════════════════ */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));


  /* ═══════════════════════════════════════════════════════════════════════
     8. ANIMATED COUNTERS
     ═══════════════════════════════════════════════════════════════════════ */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsGrid = document.getElementById('stats-grid');
  if (statsGrid) counterObserver.observe(statsGrid);

  function animateCounters() {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);

        counter.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════
     9. GALLERY FILTERS
     ═══════════════════════════════════════════════════════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          item.classList.remove('hidden');
          item.style.animation = `fadeIn 0.5s ease ${index * 0.08}s forwards`;
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* ═══════════════════════════════════════════════════════════════════════
     10. LIGHTBOX
     ═══════════════════════════════════════════════════════════════════════ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    // Open lightbox on gallery item click
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
          body.style.overflow = 'hidden';
        }
      });
    });

    // Close lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 400);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════
     11. TESTIMONIAL CAROUSEL
     ═══════════════════════════════════════════════════════════════════════ */
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let autoSlideInterval;
  const totalSlides = dots.length;

  function goToSlide(index) {
    currentSlide = index;
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
      dot.setAttribute('aria-selected', (i === currentSlide).toString());
    });
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
  }

  // Dot click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
      goToSlide(slideIndex);
      resetAutoSlide();
    });
  });

  // Auto-slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  if (totalSlides > 0) startAutoSlide();

  // Pause on hover
  const carouselContainer = document.querySelector('.testimonials-carousel');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(Math.min(currentSlide + 1, totalSlides - 1));
        } else {
          goToSlide(Math.max(currentSlide - 1, 0));
        }
        resetAutoSlide();
      }
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════════════════════════════════
     12. OFFER COUNTDOWN TIMERS
     ═══════════════════════════════════════════════════════════════════════ */
  const countdowns = document.querySelectorAll('.offer-countdown');

  function updateCountdowns() {
    const now = new Date().getTime();

    countdowns.forEach(countdown => {
      const endDate = new Date(countdown.getAttribute('data-end')).getTime();
      const diff = endDate - now;

      if (diff <= 0) {
        countdown.querySelectorAll('.countdown-number').forEach(el => {
          el.textContent = '00';
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n) => n.toString().padStart(2, '0');

      countdown.querySelectorAll('.countdown-number').forEach(el => {
        const unit = el.getAttribute('data-unit');
        switch (unit) {
          case 'days': el.textContent = pad(days); break;
          case 'hours': el.textContent = pad(hours); break;
          case 'minutes': el.textContent = pad(minutes); break;
          case 'seconds': el.textContent = pad(seconds); break;
        }
      });
    });
  }

  if (countdowns.length > 0) {
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
  }


  /* ═══════════════════════════════════════════════════════════════════════
     13. BOOKING FORM — WHATSAPP INTEGRATION
     ═══════════════════════════════════════════════════════════════════════ */
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    // Set min date to today
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('booking-name')?.value?.trim();
      const phone = document.getElementById('booking-phone')?.value?.trim();
      const email = document.getElementById('booking-email')?.value?.trim();
      const date = document.getElementById('booking-date')?.value;
      const service = document.getElementById('booking-service')?.value;
      const time = document.getElementById('booking-time')?.value;
      const message = document.getElementById('booking-message')?.value?.trim();

      // Validation
      if (!name) {
        showFormError('booking-name', 'Please enter your name');
        return;
      }
      if (!phone || phone.length < 10) {
        showFormError('booking-phone', 'Please enter a valid phone number');
        return;
      }
      if (!service) {
        showFormError('booking-service', 'Please select a service');
        return;
      }

      // Post to backend API
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, service, date, time, message })
      }).then(res => res.json()).then(data => {
          console.log('Booking saved:', data);
      }).catch(err => console.error('Booking save error:', err));

      // Get salon phone from config or default
      const salonPhone = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.contact?.phoneClean)
        ? SITE_CONFIG.contact.phoneClean
        : '918985291053';

      // Build WhatsApp message
      let whatsappText = `Hello Sri Madhuri Makeovers! I would like to book an appointment.`;
      whatsappText += `%0A%0A*Name:* ${encodeURIComponent(name)}`;
      whatsappText += `%0A*Phone:* ${encodeURIComponent(phone)}`;
      if (email) whatsappText += `%0A*Email:* ${encodeURIComponent(email)}`;
      whatsappText += `%0A*Service:* ${encodeURIComponent(service)}`;
      if (date) whatsappText += `%0A*Preferred Date:* ${encodeURIComponent(date)}`;
      if (time) whatsappText += `%0A*Preferred Time:* ${encodeURIComponent(time)}`;
      if (message) whatsappText += `%0A*Special Requests:* ${encodeURIComponent(message)}`;

      const whatsappUrl = `https://wa.me/${salonPhone}?text=${whatsappText}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  function showFormError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.style.borderColor = '#ff4444';
      field.focus();
      // Reset after 3 seconds
      setTimeout(() => {
        field.style.borderColor = '';
      }, 3000);
    }
  }


  /* ═══════════════════════════════════════════════════════════════════════
     14. NEWSLETTER FORM
     ═══════════════════════════════════════════════════════════════════════ */
  const newsletterForm = document.getElementById('newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        // Send via WhatsApp as a subscription request
        const salonPhone = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.contact?.phoneClean)
          ? SITE_CONFIG.contact.phoneClean
          : '918985291053';
        const text = `Hello! I'd like to subscribe to the Sri Madhuri Makeovers newsletter.%0A%0AEmail: ${encodeURIComponent(emailInput.value)}`;
        window.open(`https://wa.me/${salonPhone}?text=${text}`, '_blank');
        emailInput.value = '';
      }
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════
     15. SMOOTH SCROLL FOR ANCHOR LINKS
     ═══════════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetEl.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });


  /* ═══════════════════════════════════════════════════════════════════════
     16. SERVICE CARD TILT EFFECT
     ═══════════════════════════════════════════════════════════════════════ */
  if (window.innerWidth > 768) {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════
     17. BUTTON RIPPLE EFFECT
     ═══════════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.btn, .service-book-btn, .form-submit-btn').forEach(button => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out forwards;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframe animation
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleEffect {
      to { transform: scale(4); opacity: 0; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(rippleStyle);


  /* ═══════════════════════════════════════════════════════════════════════
     18. PARALLAX EFFECT ON HERO
     ═══════════════════════════════════════════════════════════════════════ */
  const heroBg = document.querySelector('.hero-bg');

  if (heroBg && window.innerWidth > 768) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      let parallaxRAF;

      function handleParallax() {
        if (parallaxRAF) return;
        parallaxRAF = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            heroBg.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
          }
          parallaxRAF = null;
        });
      }

      window.addEventListener('scroll', handleParallax, { passive: true });
    }
  }


  /* ═══════════════════════════════════════════════════════════════════════
     19. MEMBERSHIP CARD HOVER GLOW
     ═══════════════════════════════════════════════════════════════════════ */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.membership-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = `
          radial-gradient(circle at ${x}px ${y}px, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
          rgba(255, 255, 255, 0.03)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.background = '';
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════
     20. KEYBOARD NAVIGATION SUPPORT
     ═══════════════════════════════════════════════════════════════════════ */
  // Close mobile menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navMenu?.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) icon.classList.replace('fa-times', 'fa-bars');
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        mobileMenuBtn?.focus();
      }
    }
  });

  // Gallery filter keyboard navigation
  filterBtns.forEach((btn, index) => {
    btn.addEventListener('keydown', (e) => {
      let target;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        target = filterBtns[(index + 1) % filterBtns.length];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        target = filterBtns[(index - 1 + filterBtns.length) % filterBtns.length];
      }
      if (target) {
        target.focus();
        target.click();
      }
    });
  });


  /* ═══════════════════════════════════════════════════════════════════════
     INITIALIZATION COMPLETE
     ═══════════════════════════════════════════════════════════════════════ */


  console.log(
    '%c✨ Sri Madhuri Makeovers — Premium Experience Loaded',
    'color: #D4AF37; font-size: 14px; font-weight: bold; background: #0B0B0B; padding: 8px 16px; border-radius: 4px;'
  );

});
