import { initHeroCanvas } from './heroCanvas.js'

document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initHeroAnimations();
    initThemeToggle();
    initScrollReveal();
    initMouseTracking();
    initCardSpotlights();
    initMobileMenu();
    initFormHandlers();
    initSlideshows();
    initSmoothScroll();
});

function initFormHandlers() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const action = form.getAttribute('action');
            
            if (!action) {
                console.warn('Form has no action attribute defined.');
                return;
            }

            // Loading state
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Transmitting...';
            
            try {
                const formData = new FormData(form);
                const payload = Object.fromEntries(formData.entries());
                
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    submitBtn.classList.remove('loading');
                    submitBtn.textContent = originalText;
                    form.reset();
                    showToast('Transmission Successful', 'success');
                } else {
                    const data = await response.json();
                    // Handle both {error: "msg"} and {message: "msg"} formats
                    const errorMsg = data.error || data.message || 'Transmission Failed';
                    throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
                }
            } catch (err) {
                console.error('Front-end Error:', err);
                submitBtn.classList.remove('loading');
                submitBtn.textContent = 'Retry Transmission';
                showToast(err.message || 'An unexpected error occurred', 'error');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                }, 3000);
            }
        });
    });
}

function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : '✕'}</div>
        <span>${String(message)}</span>
    `;

    container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove after 4s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 600);
    }, 4000);
}

function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const body = document.body;
    const links = document.querySelectorAll('.nav-links a');

    if (toggle) {
        toggle.addEventListener('click', () => {
            body.classList.toggle('nav-active');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('nav-active');
        });
    });
}

function initCardSpotlights() {
    const cards = document.querySelectorAll('.service-item, .glass-panel');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--card-x', `${x}%`);
            card.style.setProperty('--card-y', `${y}%`);
        });
    });
}

function initMouseTracking() {
    const handleMove = (e) => {
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (clientX !== undefined && clientY !== undefined) {
            const x = (clientX / window.innerWidth) * 100;
            const y = (clientY / window.innerHeight) * 100;
            document.documentElement.style.setProperty('--mouse-x', `${x}%`);
            document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });
}

function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;
    
    const tl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 1.5 }
    });

    if (document.querySelector('.reveal-text')) {
        tl.fromTo('.reveal-text', 
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1 }
        );
    }

    if (document.querySelector('.hero-content .reveal-up')) {
        tl.fromTo('.hero-content .reveal-up',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1 },
            '-=1.2'
        );
    }
}

function initScrollReveal() {
    if (typeof gsap === 'undefined') return;

    gsap.utils.toArray('.reveal-up').forEach(el => {
        gsap.fromTo(el, 
            { y: 40, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 92%',
                    toggleActions: 'play none none none'
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out'
            }
        );
    });
}

function initSlideshows() {
    const slideshows = document.querySelectorAll('.product-banner.slideshow');
    if (slideshows.length === 0) return;

    slideshows.forEach(banner => {
        const slides = Array.from(banner.querySelectorAll('.product-photo'));
        if (slides.length <= 1) return;

        let currentIndex = 0;
        const cycleTime = parseInt(banner.dataset.interval) || 3000;

        setInterval(() => {
            const previousSlide = slides[currentIndex];
            
            // Current becomes exiting
            previousSlide.classList.remove('active');
            previousSlide.classList.add('exit');
            
            // Advance index
            currentIndex = (currentIndex + 1) % slides.length;
            
            // New active
            const nextSlide = slides[currentIndex];
            nextSlide.classList.add('active');
            
            // Cleanup old slide after transition (800ms matches CSS)
            setTimeout(() => {
                previousSlide.classList.remove('exit');
            }, 850);
        }, cycleTime);
    });
}
function initSmoothScroll() {
    // 1. Handle in-page navigation
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                // Let CSS scroll-behavior: smooth handle it
            }
        });
    });
}
