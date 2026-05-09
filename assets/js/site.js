const siteConfig = {
  company: "Evantra De-Buckman Ventures",
  email: "info@evantraventures.com",
  phone: "+233 54 744 3817",
  location: "Accra, Ghana",
};

function $(sel, root=document){return root.querySelector(sel)}
function $all(sel, root=document){return Array.from(root.querySelectorAll(sel))}

function initNav(){
  const burger = $('.burger');
  const links = $('.nav-links');
  if(!burger || !links) return;
  burger.addEventListener('click', ()=> links.classList.toggle('open'));
  $all('.nav-links a').forEach(a=> a.addEventListener('click', ()=> links.classList.remove('open')));
}

function injectConfig(){
  $all('[data-company]').forEach(n=> n.textContent = siteConfig.company);
  $all('[data-email]').forEach(n=> { n.textContent = siteConfig.email; n.href = `mailto:${siteConfig.email}`; });
  $all('[data-phone]').forEach(n=> { n.textContent = siteConfig.phone; n.href = `tel:${siteConfig.phone.replace(/\s+/g,'')}`; });
  $all('[data-location]').forEach(n=> n.textContent = siteConfig.location);
}

function initSmoothScroll(){
  $all('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      if(id.length>1){
        const el = $(id);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });
}

function initNewsletterForm(){
  const form = $('#newsletter-form');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    const messages = $('#newsletter-messages');

    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      messages.innerHTML = '<p class="small error">Please enter a valid email address.</p>';
      return;
    }

    // Placeholder: integrate with email service (Mailchimp, ConvertKit, etc.)
    messages.innerHTML = '<p class="small success">Thank you for subscribing! Check your email for confirmation.</p>';
    form.reset();

    // Clear message after 5 seconds
    setTimeout(() => {
      messages.innerHTML = '';
    }, 5000);
  });
}

// Simple Reveal Animation
const observerOptions = { threshold: 0.15 };

const revealOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
  el.classList.add('reveal-init'); // Hide elements initially
  revealOnScroll.observe(el);
});

function init(){
  injectConfig();
  initNav();
  initSmoothScroll();
  initContactForm();
  initNewsletterForm();
}
document.addEventListener('DOMContentLoaded', init);