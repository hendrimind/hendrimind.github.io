/*!
 * HENDRIMIND - Pixel Effects Engine
 * Canvas particle pixels di hero + glitch teks + floating pixels full page
 */

(function () {

    // ── 1. CANVAS PIXEL PARTICLES DI HERO SECTION ──────────────────────────
    function initHeroCanvas() {
        const masthead = document.querySelector('.masthead');
        if (!masthead) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'heroPixelCanvas';
        canvas.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 1;
        `;

        const existingPos = getComputedStyle(masthead).position;
        if (existingPos === 'static') masthead.style.position = 'relative';
        masthead.insertBefore(canvas, masthead.firstChild);

        const ctx = canvas.getContext('2d');
        let particles = [];
        const COLORS = ['#64a19d', '#0d6efd', '#adb5bd', '#ffffff', '#e4c662'];

        function resize() {
            canvas.width = masthead.offsetWidth;
            canvas.height = masthead.offsetHeight;
        }

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.floor(Math.random() * 4) + 2,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                alpha: Math.random() * 0.6 + 0.2,
                alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.005
            };
        }

        function initParticles() {
            particles = [];
            const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
            for (let i = 0; i < count; i++) particles.push(createParticle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.alpha += p.alphaDir;
                if (p.alpha <= 0.1 || p.alpha >= 0.8) p.alphaDir *= -1;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
            });
            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        }

        resize();
        initParticles();
        animate();
        window.addEventListener('resize', () => { resize(); initParticles(); });
    }

    // ── 2. FLOATING PIXEL BACKGROUND FULL PAGE ──────────────────────────────
    function initFullPagePixels() {
        const canvas = document.createElement('canvas');
        canvas.id = 'bgPixelCanvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.18;
        `;
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        let dots = [];
        const COLORS = ['#64a19d', '#0d6efd', '#ffffff', '#e4c662'];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function initDots() {
            dots = [];
            const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
            for (let i = 0; i < count; i++) {
                dots.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.floor(Math.random() * 3) + 1,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    speedY: Math.random() * 0.4 + 0.1,
                    speedX: (Math.random() - 0.5) * 0.3,
                    alpha: Math.random() * 0.5 + 0.3
                });
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach(d => {
                d.y -= d.speedY;
                d.x += d.speedX;
                if (d.y < -4) { d.y = canvas.height + 4; d.x = Math.random() * canvas.width; }
                if (d.x < 0) d.x = canvas.width;
                if (d.x > canvas.width) d.x = 0;

                ctx.globalAlpha = d.alpha;
                ctx.fillStyle = d.color;
                ctx.fillRect(Math.floor(d.x), Math.floor(d.y), d.size, d.size);
            });
            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        }

        resize();
        initDots();
        animate();
        window.addEventListener('resize', () => { resize(); initDots(); });
    }

    // ── 3. GLITCH EFFECT PADA TEKS HERO TITLE ──────────────────────────────
    function initGlitchText() {
        const el = document.querySelector('#heroTitleDisplay');
        if (!el) return;

        el.classList.add('pixel-glitch');
        el.setAttribute('data-text', el.textContent);

        function triggerGlitch() {
            el.classList.add('pixel-glitch--active');
            setTimeout(() => el.classList.remove('pixel-glitch--active'), 600);
            setTimeout(triggerGlitch, Math.random() * 4000 + 2000);
        }

        setTimeout(triggerGlitch, 1500);
    }

    // ── INIT ────────────────────────────────────────────────────────────────
    window.addEventListener('DOMContentLoaded', function () {
        initFullPagePixels();
        initHeroCanvas();
        initGlitchText();
    });

})();
