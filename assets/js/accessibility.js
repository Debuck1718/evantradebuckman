// Accessibility Improvements
document.addEventListener('DOMContentLoaded', function() {
  // Skip to main content link
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.className = 'skip-link sr-only';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add sr-only class styles via JavaScript for better compatibility
  const style = document.createElement('style');
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .sr-only:focus {
      position: static;
      width: auto;
      height: auto;
      padding: 10px;
      margin: 0;
      overflow: visible;
      clip: auto;
      white-space: normal;
      background: var(--clr-primary);
      color: white;
      z-index: 1000;
    }
  `;
  document.head.appendChild(style);

  // Improve keyboard navigation for dropdowns
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add ARIA labels where missing
  const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  buttons.forEach(button => {
    if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Button');
    }
  });
});