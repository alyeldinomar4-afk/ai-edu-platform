import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

// ─── Floating Particle Canvas ──────────────────────────
const ParticleCanvas = ({ theme }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const isDark = theme === 'dark';
        const colors = isDark
            ? ['#818cf8', '#a78bfa', '#6366f1', '#c084fc', '#38bdf8', '#818cf8cc']
            : ['#6366f1aa', '#8b5cf6aa', '#a78bfaaa', '#06b6d4aa', '#818cf899'];

        let animationId;
        let particles = [];
        let w = 0, h = 0;

        const resize = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        };

        class Particle {
            constructor() { this.reset(true); }
            reset(initial = false) {
                this.x = Math.random() * w;
                this.y = initial ? Math.random() * h : h + 10;
                this.r = 1.2 + Math.random() * 2.8;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = -(0.3 + Math.random() * 0.7);
                this.alpha = 0;
                this.targetAlpha = 0.4 + Math.random() * 0.6;
                this.fadeIn = true;
                this.life = 0;
                this.maxLife = 200 + Math.random() * 300;
                this.pulse = Math.random() * Math.PI * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life++;
                this.pulse += 0.04;
                const pulse = 1 + Math.sin(this.pulse) * 0.15;
                this.currentR = this.r * pulse;
                if (this.fadeIn) {
                    this.alpha = Math.min(this.alpha + 0.015, this.targetAlpha);
                    if (this.alpha >= this.targetAlpha) this.fadeIn = false;
                }
                if (this.life > this.maxLife - 60) {
                    this.alpha = Math.max(this.alpha - 0.02, 0);
                }
                if (this.life > this.maxLife || this.y < -20 || this.x < -20 || this.x > w + 20) {
                    this.reset();
                }
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentR, 0, Math.PI * 2);
                const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.currentR * 3);
                grd.addColorStop(0, this.color);
                grd.addColorStop(1, 'transparent');
                ctx.fillStyle = grd;
                ctx.shadowBlur = 12;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        const PARTICLE_COUNT = 80;
        const init = () => {
            resize();
            particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            animationId = requestAnimationFrame(draw);
        };

        init();
        draw();
        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
        />
    );
};

// ─── Main Auth Background ─────────────────────────────
const AuthBackground = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">

            {/* ── Base gradient background ── */}
            <div
                className="absolute inset-0 transition-colors duration-700"
                style={{
                    background: isDark
                        ? 'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 40%, #16213e 70%, #0d1b3e 100%)'
                        : 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 40%, #f5f0ff 70%, #e8f4fd 100%)',
                }}
            />

            {/* ── Aurora waves ── */}
            <div className="absolute inset-0">
                <div
                    className="auth-aurora-1 absolute rounded-full blur-[80px]"
                    style={{
                        width: '70vw', height: '60vh',
                        top: '-20vh', left: '-20vw',
                        background: isDark
                            ? 'radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.10) 50%, transparent 70%)'
                            : 'radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)',
                    }}
                />
                <div
                    className="auth-aurora-2 absolute rounded-full blur-[100px]"
                    style={{
                        width: '60vw', height: '55vh',
                        bottom: '-15vh', right: '-15vw',
                        background: isDark
                            ? 'radial-gradient(ellipse, rgba(192,132,252,0.15) 0%, rgba(56,189,248,0.08) 50%, transparent 70%)'
                            : 'radial-gradient(ellipse, rgba(192,132,252,0.08) 0%, rgba(56,189,248,0.05) 50%, transparent 70%)',
                    }}
                />
                <div
                    className="auth-aurora-3 absolute rounded-full blur-[120px]"
                    style={{
                        width: '50vw', height: '50vh',
                        top: '30vh', left: '30vw',
                        background: isDark
                            ? 'radial-gradient(ellipse, rgba(56,189,248,0.10) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)'
                            : 'radial-gradient(ellipse, rgba(56,189,248,0.06) 0%, rgba(99,102,241,0.04) 50%, transparent 70%)',
                    }}
                />
            </div>

            {/* ── Glowing grid ── */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(${isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)'} 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
                }}
            />

            {/* ── Floating geometric shapes ── */}
            <div className="absolute inset-0">
                {/* Top-left hexagon */}
                <div
                    className="auth-shape-spin absolute opacity-[0.06] dark:opacity-[0.12]"
                    style={{
                        width: 160, height: 160,
                        top: '8%', left: '6%',
                        border: `2px solid ${isDark ? '#818cf8' : '#6366f1'}`,
                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                        animationDuration: '25s',
                    }}
                />
                {/* Bottom-right rotated square */}
                <div
                    className="auth-shape-spin-reverse absolute opacity-[0.05] dark:opacity-[0.10]"
                    style={{
                        width: 120, height: 120,
                        bottom: '12%', right: '8%',
                        border: `2px solid ${isDark ? '#c084fc' : '#a855f7'}`,
                        transform: 'rotate(45deg)',
                        animationDuration: '20s',
                    }}
                />
                {/* Middle-left circle ring */}
                <div
                    className="auth-shape-float absolute opacity-[0.07] dark:opacity-[0.14]"
                    style={{
                        width: 90, height: 90,
                        top: '45%', left: '4%',
                        border: `1.5px solid ${isDark ? '#38bdf8' : '#0ea5e9'}`,
                        borderRadius: '50%',
                        animationDuration: '18s',
                    }}
                />
                {/* Top-right triangle-ish */}
                <div
                    className="auth-shape-float absolute opacity-[0.06] dark:opacity-[0.10]"
                    style={{
                        width: 70, height: 70,
                        top: '15%', right: '10%',
                        border: `1.5px solid ${isDark ? '#a78bfa' : '#8b5cf6'}`,
                        borderRadius: '20% 80% 20% 80% / 80% 20% 80% 20%',
                        animationDuration: '22s',
                        animationDelay: '3s',
                    }}
                />
                {/* Bottom-center ring */}
                <div
                    className="auth-shape-spin absolute opacity-[0.05] dark:opacity-[0.09]"
                    style={{
                        width: 200, height: 200,
                        bottom: '-5%', left: '35%',
                        border: `1px solid ${isDark ? '#6366f1' : '#818cf8'}`,
                        borderRadius: '50%',
                        animationDuration: '35s',
                    }}
                />
            </div>

            {/* ── Animated particle canvas ── */}
            <ParticleCanvas theme={theme} />

            {/* ── Vignette overlay ── */}
            <div
                className="absolute inset-0"
                style={{
                    background: isDark
                        ? 'radial-gradient(ellipse at center, transparent 40%, rgba(10,8,40,0.6) 100%)'
                        : 'radial-gradient(ellipse at center, transparent 50%, rgba(240,244,255,0.4) 100%)',
                }}
            />
        </div>
    );
};

export default AuthBackground;
