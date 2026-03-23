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

function initContactForm(){
  const form = $('#contact-form');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const errors = [];
    if(!data.name || data.name.length < 2) errors.push("Please provide your full name.");
    if(!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("Please enter a valid email address.");
    if(!data.message || data.message.length < 10) errors.push("Message should be at least 10 characters.");

    const box = $('#form-messages');
    box.innerHTML = '';
    if(errors.length){
      box.innerHTML = `<div class="card" role="alert"><strong>Fix the following:</strong><ul>${errors.map(e=>`<li>${e}</li>`).join('')}</ul></div>`;
      return;
    }
    // Placeholder: integrate with form backend (Netlify Forms, Formspree, etc.)
    box.innerHTML = `<div class="card" role="status">Thank you! Your message has been submitted. We'll get back to you shortly.</div>`;
    form.reset();
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
}
document.addEventListener('DOMContentLoaded', init);