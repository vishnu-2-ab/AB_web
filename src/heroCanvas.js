let stars = [];

export function initHeroCanvas() {
    initStars();
    setupCanvas('global-bg', drawHero);
}

export function initPhiCanvas() {
    setupCanvas('phi-canvas', drawPhi);
}

function initStars() {
    stars = [];
    const count = 150;
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 1.5,
            opacity: Math.random(),
            twinkle: Math.random() * 0.02
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
        if (star.opacity > 1 || star.opacity < 0.2) star.twinkle *= -1;
        
        ctx.fillStyle = `rgba(${starColor}, ${starColor}, ${starColor}, ${starColor === 255 ? star.opacity * 0.6 : star.opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Very subtle drift
        star.x += 0.00002;
        if (star.x > 1) star.x = 0;
    });
}

function drawPhi(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const time = Date.now() * 0.001;
    const color = isDark ? 'rgba(141, 198, 63, 0.4)' : 'rgba(125, 181, 52, 0.4)';
    const center = { x: w / 2, y: h / 2 };

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
        const radius = 40 * i;
        ctx.beginPath();
        ctx.setLineDash([5, 15]);
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.globalAlpha = 0.4 / i;
        ctx.stroke();
    }

    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    const pulse = Math.sin(time * 2) * 2 + 5;
    ctx.beginPath();
    ctx.arc(center.x, center.y, pulse, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 4; i++) {
        const angle = time + (i * Math.PI / 2);
        const radius = 80;
        const px = center.x + Math.cos(angle) * radius;
        const py = center.y + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(px, py);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.1;
        ctx.stroke();
    }
}
