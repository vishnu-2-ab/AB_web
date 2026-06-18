let stars = [];

export function initHeroCanvas() {
    initStars();
    setupCanvas('global-bg', drawHero);
}


function initStars() {
    stars = [];
    const count = 300; // Increased density
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 2.5, // Larger range
            opacity: Math.random(),
            twinkle: 0.005 + Math.random() * 0.02, // More varied twinkle speeds
            bloom: Math.random() > 0.8 // Randomly assign bloom to some stars
        });
    }
}

function setupCanvas(id, drawFn) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function loop() {
        drawFn(ctx, canvas.offsetWidth, canvas.offsetHeight);
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    loop();
}

function drawHero(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
    const starColor = isDark ? 255 : 0;
    
    // Draw Grid
    ctx.fillStyle = gridColor;
    const spacing = 80;
    for (let x = 0; x < w; x += spacing) {
        for (let y = 0; y < h; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Draw Twinkling Stars
    stars.forEach(star => {
        star.opacity += star.twinkle;
        if (star.opacity > 1 || star.opacity < 0.1) star.twinkle *= -1;
        
        // Intensity multiplier
        const intensity = isDark ? 0.85 : 0.45; 
        
        ctx.fillStyle = `rgba(${starColor}, ${starColor}, ${starColor}, ${star.opacity * intensity})`;
        
        if (star.bloom && isDark) {
            ctx.shadowBlur = 8 * star.opacity;
            ctx.shadowColor = `rgba(255,255,255,${star.opacity * 0.5})`;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Subtle drift
        star.x += 0.00003;
        if (star.x > 1) star.x = 0;
    });
    
    // Reset shadow for performance
}
