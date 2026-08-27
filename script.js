"use strict";

// ======================================================
// 💗 NUESTRO UNIVERSO — SCRIPT
// Pensado para celular / iPhone
// ======================================================

const canvas = document.getElementById("universo");
const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;
let particles = [];
let stars = [];
let shootingStars = [];
let started = false;

// ------------------------------------------------------
// 📱 Tamaño del universo
// ------------------------------------------------------

function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resize();
window.addEventListener("resize", resize);

// ------------------------------------------------------
// ✨ Estrellas de fondo
// ------------------------------------------------------

function createStars() {
    stars = [];

    const amount = Math.floor((W * H) / 7000);

    for (let i = 0; i < amount; i++) {
        stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.8 + 0.2,
            speed: Math.random() * 0.02 + 0.005,
            phase: Math.random() * Math.PI * 2
        });
    }
}

createStars();

window.addEventListener("resize", createStars);

// ------------------------------------------------------
// 🌌 Partículas del universo
// ------------------------------------------------------

function createParticles() {
    particles = [];

    const amount = W < 600 ? 650 : 950;

    for (let i = 0; i < amount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.pow(Math.random(), 0.55) * Math.min(W, H) * 0.48;

        const centerX = W / 2;
        const centerY = H * 0.43;

        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance * 0.72;

        particles.push({
            x: x,
            y: y,

            baseX: x,
            baseY: y,

            size: Math.random() * 1.8 + 0.4,

            alpha: Math.random() * 0.8 + 0.15,

            pink:
                Math.random() > 0.15
                    ? Math.floor(Math.random() * 90 + 150)
                    : 255,

            depth: Math.random(),

            vx: 0,
            vy: 0,

            angle: Math.random() * Math.PI * 2,

            speed: Math.random() * 0.004 + 0.001
        });
    }
}

createParticles();

// ------------------------------------------------------
// 🌠 Estrellas fugaces
// ------------------------------------------------------

function createShootingStar() {
    shootingStars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.65,
        length: Math.random() * 90 + 50,
        speed: Math.random() * 8 + 7,
        alpha: 1
    });
}

setInterval(() => {
    if (Math.random() > 0.25) {
        createShootingStar();
    }
}, 3500);

// ------------------------------------------------------
// ✨ Dibujar fondo
// ------------------------------------------------------

function drawBackground() {
    const gradient = ctx.createRadialGradient(
        W / 2,
        H * 0.42,
        0,
        W / 2,
        H * 0.42,
        Math.max(W, H)
    );

    gradient.addColorStop(0, "#5b0b45");
    gradient.addColorStop(0.35, "#310526");
    gradient.addColorStop(0.75, "#120013");
    gradient.addColorStop(1, "#050008");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
}

// ------------------------------------------------------
// ⭐ Dibujar estrellas
// ------------------------------------------------------

function drawStars(time) {
    for (const star of stars) {
        const glow =
            star.alpha +
            Math.sin(time * star.speed + star.phase) * 0.25;

        ctx.beginPath();

        ctx.fillStyle = `rgba(255,190,235,${Math.max(
            0.1,
            glow
        )})`;

        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);

        ctx.fill();
    }
}

// ------------------------------------------------------
// 💫 Partículas
// ------------------------------------------------------

function drawParticles(time) {
    for (const p of particles) {
        p.angle += p.speed;

        const movementX = Math.cos(p.angle + time * 0.0002) * 1.5;
        const movementY = Math.sin(p.angle + time * 0.0003) * 1.5;

        p.x = p.baseX + movementX;
        p.y = p.baseY + movementY;

        const depthSize = p.size * (0.7 + p.depth * 1.8);

        ctx.beginPath();

        ctx.fillStyle = rgba(255,${p.pink},235,${p.alpha});

        ctx.arc(
            p.x,
            p.y,
            depthSize,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // pequeño brillo para algunas partículas
        if (p.depth > 0.93) {
            ctx.beginPath();

            ctx.fillStyle = "rgba(255,255,255,0.8)";

            ctx.arc(
                p.x,
                p.y,
                depthSize * 0.35,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }
}

// ------------------------------------------------------
// 🌠 Estrellas fugaces
// ------------------------------------------------------

function drawShootingStars() {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];

        s.x += s.speed;
        s.y += s.speed * 0.35;
        s.alpha -= 0.015;

        const gradient = ctx.createLinearGradient(
            s.x,
            s.y,
            s.x - s.length,
            s.y - s.length * 0.35
        );

        gradient.addColorStop(
            0,
            rgba(255,255,255,${s.alpha})
        );

        gradient.addColorStop(
            1,
            "rgba(255,120,220,0)"
        );

        ctx.beginPath();

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;

        ctx.moveTo(s.x, s.y);

        ctx.lineTo(
            s.x - s.length,
            s.y - s.length * 0.35
        );

        ctx.stroke();

        if (s.alpha <= 0) {
            shootingStars.splice(i, 1);
        }
    }
}

// ------------------------------------------------------
// 💗 Corazón brillante
// ------------------------------------------------------

function drawHeart(time) {
    const x = W / 2;
    const y = H * 0.43;

    const pulse = 1 + Math.sin(time * 0.003) * 0.05;

    ctx.save();

    ctx.translate(x, y);
    ctx.scale(pulse, pulse);

    ctx.beginPath();

    ctx.moveTo(0, 22);

    ctx.bezierCurveTo(
        -55,
        -18,
        -35,
        -55,
        0,
        -28
    );

    ctx.bezierCurveTo(
        35,
        -55,
        55,
        -18,
        0,
        22
    );

    ctx.strokeStyle = "rgba(255,170,235,0.35)";
    ctx.lineWidth = 2;

    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255,100,210,0.8)";

    ctx.stroke();

    ctx.restore();
}

// ------------------------------------------------------
// 🎬 Animación principal
// ------------------------------------------------------

function animate(time) {
    drawBackground();
    drawStars(time);
    drawParticles(time);
    drawShootingStars();
    drawHeart(time);

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// ======================================================
// 💌 FRASES
// ======================================================

const phrases = [
    "Tu existencia, fue lo más bonito que le pudo pasar a la mía.",
    "No necesito un universo perfecto, si puedo compartir el mío contigo.",
    "Gracias por todos los momentos juntas.",
    "Estos 3 meses son solo el comienzo de todo lo que quiero vivir contigo.",
    "Te elegiría una y mil veces.",
    "Contigo, todo tiene más sentido. Gracias por formar parte de mi universo.",
    "Te amo un montón. 💗"
];

let phraseIndex = 0;

// ------------------------------------------------------
// Crear contenedor de frases automáticamente
// ------------------------------------------------------

let phraseBox = document.getElementById("mensaje");

if (!phraseBox) {
    phraseBox = document.createElement("div");
    phraseBox.id = "mensaje";

    document.body.appendChild(phraseBox);
}

phraseBox.style.position = "fixed";
phraseBox.style.left = "50%";
phraseBox.style.top = "75%";
phraseBox.style.transform = "translate(-50%, -50%)";
phraseBox.style.width = "88%";
phraseBox.style.maxWidth = "650px";
phraseBox.style.textAlign = "center";
phraseBox.style.color = "white";
phraseBox.style.fontFamily = "Georgia, serif";
phraseBox.style.fontSize = "clamp(20px, 5vw, 32px)";
phraseBox.style.lineHeight = "1.35";
phraseBox.style.textShadow =
    "0 0 10px rgba(255,150,230,.8), 0 0 25px rgba(255,80,200,.5)";
phraseBox.style.opacity = "0";
phraseBox.style.transition =
    "opacity 1.2s ease";
phraseBox.style.pointerEvents = "none";
phraseBox.style.zIndex = "20";

// ------------------------------------------------------
// Mostrar frase
// ------------------------------------------------------

function showPhrase(text) {
    phraseBox.style.opacity = "0";

    setTimeout(() => {
        phraseBox.textContent = text;
        phraseBox.style.opacity = "1";
    }, 700);
}

// ------------------------------------------------------
// 💗 Secuencia de frases
// ------------------------------------------------------

function startPhrases() {
    if (started) return;

    started = true;

    phraseIndex = 0;

    showPhrase(phrases[phraseIndex]);

    setInterval(() => {
        phraseIndex++;

        if (phraseIndex >= phrases.length) {
            phraseIndex = phrases.length - 1;
            return;
        }

        showPhrase(phrases[phraseIndex]);

    }, 5000);
}

// ======================================================
// 🎵 MÚSICA
// ======================================================

let music = document.getElementById("musica");

if (!music) {
    music = document.createElement("audio");
    music.id = "musica";

    music.src = "assets/timeless.mp3";

    music.loop = true;
    music.preload = "auto";

    document.body.appendChild(music);
} else {
    music.src = "assets/timeless.mp3";
}

music.volume = 0.55;

// ------------------------------------------------------
// 📱 iPhone necesita interacción del usuario
// ------------------------------------------------------

function startExperience() {
    startPhrases();

    music.play().catch(() => {
        // Safari/iPhone puede bloquear el audio
        // hasta detectar otra interacción.
    });

    document.removeEventListener(
        "click",
        startExperience
    );

    document.removeEventListener(
        "touchstart",
        startExperience
    );
}

document.addEventListener(
    "click",
    startExperience,
    { once: false }
);

document.addEventListener(
    "touchstart",
    startExperience,
    { once: false, passive: true }
);

// ------------------------------------------------------
// Si existe botón "Entrar"
// ------------------------------------------------------

const enterButton =
    document.getElementById("entrar") ||
    document.getElementById("enter") ||
    document.querySelector(".entrar") ||
    document.querySelector(".enter");

if (enterButton) {
    enterButton.addEventListener("click", () => {
        startExperience();
    });
}
