/* ==========================================================
   PORTFOLIO — MAIN JAVASCRIPT
   Author: Bhavesh | Data Scientist
   
   SECTIONS:
   1. Navbar scroll effect
   2. Typing effect (hero role text)
   3. Scroll reveal animations
   4. Stat counter animation
   5. Skill bar animation
   6. Project filter tabs
   7. Contact form handler
   8. Active nav link highlight
   ========================================================== */


/* ----------------------------------------------------------
   1. NAVBAR SCROLL EFFECT
   Adds .scrolled class to navbar when user scrolls down
   — This triggers a darker/more opaque background via CSS
   ---------------------------------------------------------- */
const mainNav = document.getElementById('mainNav');

if (mainNav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  });
}


/* ----------------------------------------------------------
   2. TYPING EFFECT
   Cycles through an array of roles, typing and deleting
   each string character by character
   ---------------------------------------------------------- */
const typedEl = document.getElementById('typedText');

if (typedEl) {
  // Array of roles to cycle through
  const roles = [
    'Data Scientist',
    'Web Developer',
    'Python Developer',
    'Data Analyst',
  ];

  let roleIndex = 0;   // Which role we're currently on
  let charIndex = 0;   // Which character within that role
  let isDeleting = false;

  function typeEffect() {
    const current = roles[roleIndex];

    if (isDeleting) {
      // Remove one character
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      // Add one character
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
    }

    // Typing speed: faster when deleting
    let delay = isDeleting ? 60 : 110;

    if (!isDeleting && charIndex === current.length) {
      // Finished typing — pause before deleting
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next role
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeEffect, delay);
  }

  // Kick off the typing loop
  setTimeout(typeEffect, 800);
}


/* ----------------------------------------------------------
   3. SCROLL REVEAL ANIMATIONS
   Elements with class .reveal become visible
   when they enter the viewport
   ---------------------------------------------------------- */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after triggering (animate once)
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 } // 15% of element must be visible
  );

  revealEls.forEach((el) => observer.observe(el));
}

initReveal();


/* ----------------------------------------------------------
   4. STAT COUNTER ANIMATION
   Numbers count up from 0 to their target (data-count attr)
   when the stats strip scrolls into view
   ---------------------------------------------------------- */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');

  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count, 10);
          let current = 0;
          const increment = Math.ceil(target / 40); // ~40 steps
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            entry.target.textContent = current + '+';
          }, 40);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

animateCounters();


/* ----------------------------------------------------------
   5. SKILL BAR ANIMATION
   Progress bars animate to their width when visible.
   Bootstrap's progress bars use inline width style — we
   store the target in data-width and animate via JS.
   ---------------------------------------------------------- */
function animateSkillBars() {
  const bars = document.querySelectorAll('.progress-bar[data-width]');

  if (!bars.length) return;

  // Start all bars at 0
  bars.forEach((bar) => {
    bar.style.width = '0%';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.width;
          // Small delay for visual effect
          setTimeout(() => {
            entry.target.style.width = target;
          }, 200);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

animateSkillBars();


/* ----------------------------------------------------------
   6. PROJECT FILTER TABS
   Clicking a filter tab hides/shows project cards
   by their data-category attribute
   ---------------------------------------------------------- */
function initFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card-wrap');

  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter; // e.g. "ml", "nlp", "all"

      cards.forEach((card) => {
        const category = card.dataset.category;

        if (filter === 'all' || category === filter) {
          // Show card with fade-in
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.4s ease';
          }, 50);
        } else {
          // Hide card
          card.style.display = 'none';
        }
      });
    });
  });
}

initFilters();


/* ----------------------------------------------------------
   7. CONTACT FORM HANDLER
   Intercepts submit, validates, and shows success message.
   For real email sending: integrate EmailJS or FormSpree.
   ---------------------------------------------------------- */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop page reload

    // Gather values
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic client-side validation
    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    /* 
      INTEGRATION POINT — Replace this block with:
      
      Option A: EmailJS (free, no backend)
        emailjs.send('serviceID', 'templateID', { name, email, subject, message })
        
      Option B: FormSpree
        fetch('https://formspree.io/f/YOUR_ID', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        })
    */

    // For now — show success and reset form
    showToast('Message sent! I\'ll reply within 24 hours.', 'success');
    contactForm.reset();
  });
}

/* Helper: Simple toast notification */
function showToast(msg, type) {
  // Remove existing toast
  const existing = document.getElementById('customToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'customToast';
  toast.style.cssText = `
    position: fixed;
    bottom: 30px; right: 30px;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    z-index: 9999;
    animation: fadeInUp 0.4s ease;
    max-width: 300px;
    ${type === 'success'
      ? 'background:#0d1630; border:1px solid #00f5ff; color:#00f5ff; box-shadow:0 0 20px rgba(0,245,255,0.3);'
      : 'background:#0d1630; border:1px solid #f97316; color:#f97316;'
    }
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  // Auto remove after 4 seconds
  setTimeout(() => toast.remove(), 4000);
}


/* ----------------------------------------------------------
   8. ACTIVE NAV LINK HIGHLIGHT
   Marks the correct nav link as .active based on current URL
   ---------------------------------------------------------- */
(function highlightActiveNav() {
  const links = document.querySelectorAll('.navbar-nav .nav-link');
  const current = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach((link) => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === current) {
      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
})();


/* ----------------------------------------------------------
   MOBILE NAV — Auto-close menu after clicking a link
   ---------------------------------------------------------- */
document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const toggler = document.querySelector('.navbar-toggler');
    const menu    = document.getElementById('navMenu');
    if (menu && menu.classList.contains('show')) {
      toggler.click(); // Bootstrap toggle
    }
  });
});
