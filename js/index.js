// Add some interactive features

document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all feature cards
    document.querySelectorAll('.feature-card, .preset-item, .language-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Add click handlers for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Add a small animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Language tab switching logic for index.html
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.lang-tab');
    const contents = document.querySelectorAll('.lang-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        // Tab UI
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        // Content switching
        contents.forEach(c => {
          if (c.getAttribute('data-lang') === lang) {
            c.classList.add('active');
            // Set html lang/dir
            document.documentElement.lang = lang;
            document.documentElement.dir = (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr';
          } else {
            c.classList.remove('active');
          }
        });
      });
    });
  });
})(); 