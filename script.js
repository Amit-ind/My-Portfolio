/* ==========================================================
   script.js — Amit Bastia Portfolio
   Handles:
     1. Footer year (dynamic)
     2. Theme toggle (light / dark) with:
        - Auto mode based on time of day (18:00–06:00 = dark)
        - localStorage persistence for manual preference
        - Sun/Moon icon swap
     3. Mobile navbar: close on nav-link click
     4. Contact form: thank-you alert + reset
   ========================================================== */

/* ----------------------------------------------------------
   Utility: Apply a theme ("light" or "dark")
   Sets data-theme on <html>, updates the toggle icon,
   and saves the preference to localStorage.
   ---------------------------------------------------------- */
function applyTheme(theme, save) {
  // Set the data-theme attribute on <html> so CSS variables pick it up
  document.documentElement.setAttribute('data-theme', theme);

  // Swap the icon: moon = light mode (click to go dark), sun = dark mode
  var icon = document.getElementById('themeIcon');
  if (icon) {
    if (theme === 'dark') {
      icon.className = 'bi bi-sun';          // show sun in dark mode
    } else {
      icon.className = 'bi bi-moon-stars';   // show moon in light mode
    }
  }

  // Persist manual choice (save = true only on manual click)
  if (save) {
    localStorage.setItem('amitPortfolioTheme', theme);
  }
}

/* ----------------------------------------------------------
   1. THEME INITIALISATION ON PAGE LOAD
   Priority order:
     a) localStorage saved preference  (manual wins)
     b) Time-based auto: 18:00–06:00 → dark, else → light
   ---------------------------------------------------------- */
(function initTheme() {
  var saved = localStorage.getItem('amitPortfolioTheme');

  if (saved === 'dark' || saved === 'light') {
    // User has a saved preference — use it
    applyTheme(saved, false);
  } else {
    // Auto-detect based on current hour
    var hour = new Date().getHours(); // 0–23
    // Dark between 18:00 (6 PM) and 05:59 (before 6 AM)
    var autoDark = (hour >= 18 || hour < 6);
    applyTheme(autoDark ? 'dark' : 'light', false);
  }
})();

/* ----------------------------------------------------------
   Wait for DOM to be fully loaded before touching elements
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------------
     2. THEME TOGGLE BUTTON — manual click handler
  -------------------------------------------------------- */
  var toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      // Read current theme and flip it
      var current = document.documentElement.getAttribute('data-theme');
      var next = (current === 'dark') ? 'light' : 'dark';
      // save = true → persist to localStorage
      applyTheme(next, true);
    });
  }

  /* --------------------------------------------------------
     3. FOOTER: DYNAMIC YEAR
     Writes the current year into <span id="year">
  -------------------------------------------------------- */
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------
     4. MOBILE NAVBAR: close collapse after clicking a link
     Without this the menu stays open after navigation.
  -------------------------------------------------------- */
  var navCollapse = document.getElementById('navbarNav');
  var navLinks    = document.querySelectorAll('#navbarNav .nav-link');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      // Only collapse if the navbar is currently open (mobile view)
      if (navCollapse && navCollapse.classList.contains('show')) {
        // Use Bootstrap's Collapse API to close it
        var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  /* --------------------------------------------------------
     5. CONTACT FORM: submit handler
     Shows a polite thank-you alert, then resets the form.
     (Replace the alert with a real backend/email service
     like EmailJS or Formspree when you go live.)
  -------------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault(); // stop the default page reload

      // Basic HTML5 validation check
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      // Thank-you message (replace alert() with a nicer toast/modal if you like)
      alert(
        'Thank you for your message!\n\n' +
        'I will get back to you as soon as possible.'
      );

      // Clear all fields after submission
      contactForm.reset();
    });
  }

}); // end DOMContentLoaded
