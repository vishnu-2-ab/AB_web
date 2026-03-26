import { initHeroCanvas } from './heroCanvas.js'

document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initHeroAnimations();
    initThemeToggle();
    initScrollReveal();
    initMouseTracking();
    initCardSpotlights();
    initMobileMenu();
});

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

    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);

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
        tl.from('.reveal-text', {
            y: 80,
            opacity: 0,
            stagger: 0.1
        });
    }

    if (document.querySelector('.hero-content .reveal-up')) {
        tl.from('.hero-content .reveal-up', {
            y: 30,
            opacity: 0,
            stagger: 0.1
        }, '-=1.2');
    }
}

function initScrollReveal() {
    if (typeof gsap === 'undefined') return;

    gsap.utils.toArray('.reveal-up').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 92%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    });
}
