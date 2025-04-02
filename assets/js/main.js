document.addEventListener('DOMContentLoaded', () => {
    console.log("🎯 Portfolio chargé !");
  
    // ========== 1. Animation au scroll ==========
    const animatedItems = document.querySelectorAll('.animate');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
  
    animatedItems.forEach(item => observer.observe(item));
  
    // ========== 2. Lightbox pour les images ==========
    const lightboxImages = document.querySelectorAll('.lightbox');
  
    if (lightboxImages.length > 0) {
      const lightbox = document.createElement('div');
      lightbox.id = 'lightbox-overlay';
      lightbox.style.position = 'fixed';
      lightbox.style.top = 0;
      lightbox.style.left = 0;
      lightbox.style.width = '100%';
      lightbox.style.height = '100%';
      lightbox.style.background = 'rgba(0,0,0,0.9)';
      lightbox.style.display = 'flex';
      lightbox.style.alignItems = 'center';
      lightbox.style.justifyContent = 'center';
      lightbox.style.zIndex = 1000;
      lightbox.style.visibility = 'hidden';
      lightbox.style.opacity = 0;
      lightbox.style.transition = 'opacity 0.3s ease';
  
      const lightboxImg = document.createElement('img');
      lightboxImg.style.maxWidth = '90%';
      lightboxImg.style.maxHeight = '90%';
      lightbox.appendChild(lightboxImg);
      document.body.appendChild(lightbox);
  
      lightboxImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
          lightboxImg.src = img.src;
          lightbox.style.visibility = 'visible';
          lightbox.style.opacity = 1;
        });
      });
  
      lightbox.addEventListener('click', () => {
        lightbox.style.opacity = 0;
        setTimeout(() => {
          lightbox.style.visibility = 'hidden';
        }, 300);
      });
    }
  
    // ========== 3. Gestion formulaire contact ==========
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("📨 Merci pour votre message !");
        form.reset();
      });
    }
  
    // ========== 4. (Optionnel) Dark mode toggle ==========
     const toggle = document.getElementById('dark-mode-toggle');
     if (toggle) {
       toggle.addEventListener('click', () => {
         document.body.classList.toggle('dark');
         localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'enabled' : 'disabled');
       });
       if (localStorage.getItem('darkMode') === 'enabled') {
         document.body.classList.add('dark');
       }
     }
  });
  