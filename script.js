"use strict";

/* =========================================================
   NUESTRO UNIVERSO — GALAXIA VIVA
   Versión 2: galaxia espiral + profundidad + meteoros
========================================================= */

const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;
let DPR = 1;

let backgroundStars = [];
let galaxyStars = [];
let foregroundStars = [];
let shootingStars = [];

let started = false;
let startTime = 0;

let mouseX = 0;
let mouseY = 0;
let smoothX = 0;
let smoothY = 0;


/* =========================================================
   UTILIDADES
========================================================= */

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


/* =========================================================
   RESIZE
========================================================= */

function resize() {

    W = window.innerWidth;
    H = window.innerHeight;

    DPR = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(
        DPR,
        0,
        0,
        DPR,
        0,
        0
    );

    createUniverse();
}

window.addEventListener("resize", resize);


/* =========================================================
   CREAR UNIVERSO
========================================================= */

function createUniverse() {

    backgroundStars = [];
    galaxyStars = [];
    foregroundStars = [];
    shootingStars = [];


    /* -----------------------------------------------------
       ESTRELLAS DEL FONDO
    ----------------------------------------------------- */

    const backgroundAmount = W < 600 ? 380 : 600;

    for (let i = 0; i < backgroundAmount; i++) {

        backgroundStars.push({

            x: Math.random() * W,
            y: Math.random() * H,

            size: random(0.15, 1.15),

            brightness: random(0.2, 0.8),

            depth: random(0.05, 0.35),

            phase: random(0, Math.PI * 2),

            twinkle: random(0.006, 0.025)

        });
    }


    /* -----------------------------------------------------
       GALAXIA
    ----------------------------------------------------- */

    const galaxyAmount = W < 600 ? 2300 : 3400;

    const arms = 4;

    for (let i = 0; i < galaxyAmount; i++) {

        /*
          Distribución radial.
          Esto concentra estrellas en el núcleo.
        */

        const radius =
            Math.pow(Math.random(), 0.58) *
            Math.max(W, H) *
            0.62;


        /*
          Elegimos uno de los brazos.
        */

        const arm =
            Math.floor(Math.random() * arms);


        /*
          Curvatura de la espiral.
        */

        const armAngle =
            (Math.PI * 2 / arms) * arm;


        const spiralCurve =
            radius * 0.00215;


        /*
          Ruido para que no parezca
          una espiral matemática perfecta.
        */

        const spread =
            random(-0.22, 0.22) *
            (0.4 + radius / Math.max(W, H));


        galaxyStars.push({

            radius,

            angle:
                armAngle +
                spiralCurve +
                spread,

            arm,

            depth: random(0.05, 1),

            size: random(0.2, 1.45),

            brightness: random(0.25, 1),

            speed: random(0.00008, 0.00055),

            phase: random(0, Math.PI * 2)

        });
    }


    /* -----------------------------------------------------
       ESTRELLAS CERCANAS
    ----------------------------------------------------- */

    const foregroundAmount = W < 600 ? 350 : 550;

    for (let i = 0; i < foregroundAmount; i++) {

        foregroundStars.push({

            x: Math.random() * W,
            y: Math.random() * H,

            size: random(0.5, 2.4),

            depth: random(0.5, 1),

            phase: random(0, Math.PI * 2),

            speed: random(0.002, 0.008)

        });
    }


    /* -----------------------------------------------------
       ESTRELLAS FUGACES
    ----------------------------------------------------- */

    for (let i = 0; i < 4; i++) {

        shootingStars.push(
            createShootingStar(true)
        );

    }
}


/* =========================================================
   CREAR ESTRELLA FUGAZ
========================================================= */

function createShootingStar(initial = false) {

    return {

        x:
            initial
                ? random(0, W)
                : random(-100, W),

        y:
            initial
                ? random(0, H * 0.55)
                : random(-100, H * 0.45),

        speed: random(6, 12),

        length: random(80, 180),

        width: random(0.8, 1.8),

        alpha:
            initial
                ? random(0, 0.45)
                : 1,

        delay:
            initial
                ? random(0, 7)
                : random(1, 5)

    };
}


/* =========================================================
   FONDO PROFUNDO
========================================================= */

function drawBackground(time) {

    const centerX =
        W * 0.5 +
        smoothX * 12;

    const centerY =
        H * 0.48 +
        smoothY * 8;


    /*
      Fondo negro-violeta.
    */

    const bg =
        ctx.createRadialGradient(

            centerX,
            centerY,
            0,

            centerX,
            centerY,
            Math.max(W, H) * 0.95

        );


    bg.addColorStop(
        0,
        "#350027"
    );

    bg.addColorStop(
        0.18,
        "#21001a"
    );

    bg.addColorStop(
        0.42,
        "#10000e"
    );

    bg.addColorStop(
        0.72,
        "#050006"
    );

    bg.addColorStop(
        1,
        "#010002"
    );


    ctx.fillStyle = bg;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /*
      Nebulosa exterior.
    */

    const pulse =
        Math.sin(time * 0.18) * 0.5 + 0.5;


    const nebula =
        ctx.createRadialGradient(

            centerX,
            centerY,
            Math.min(W, H) * 0.05,

            centerX,
            centerY,
            Math.max(W, H) * 0.68

        );


    nebula.addColorStop(
        0,
        `rgba(255, 65, 190, ${0.08 + pulse * 0.025})`
    );

    nebula.addColorStop(
        0.25,
        `rgba(190, 25, 145, ${0.055 + pulse * 0.015})`
    );

    nebula.addColorStop(
        0.55,
        "rgba(90, 8, 85, 0.025)"
    );

    nebula.addColorStop(
        1,
        "rgba(255, 0, 150, 0)"
    );


    ctx.fillStyle = nebula;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

}


/* =========================================================
   ESTRELLAS LEJANAS
========================================================= */

function drawBackgroundStars(time) {

    for (const star of backgroundStars) {

        star.phase += star.twinkle;


        const twinkle =
            0.55 +
            Math.sin(star.phase) * 0.35;


        const x =
            star.x +
            smoothX * 18 * star.depth;

        const y =
            star.y +
            smoothY * 12 * star.depth;


        ctx.beginPath();

        ctx.fillStyle =
            `rgba(
                255,
                220,
                245,
                ${star.brightness * twinkle}
            )`;


        ctx.arc(
            x,
            y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


/* =========================================================
   GALAXIA ESPIRAL
========================================================= */

function drawGalaxy(time) {

    if (!started) {
        return;
    }


    const elapsed =
        time - startTime;


    /*
      Aparición inicial.
    */

    const appear =
        clamp(
            elapsed / 4.5,
            0,
            1
        );


    /*
      Hace que aparezca desde el centro.
    */

    const formation =
        1 -
        Math.pow(
            1 - appear,
            2.8
        );


    const centerX =
        W * 0.5 +
        smoothX * 14;

    const centerY =
        H * 0.48 +
        smoothY * 9;


    /*
      Rotación extremadamente lenta.
    */

    const rotation =
        time * 0.018;


    /*
      Galaxia ligeramente inclinada.
    */

    const flatten =
        W < 600
            ? 0.38
            : 0.32;


    for (const star of galaxyStars) {

        /*
          Movimiento orbital.
        */

        star.phase +=
            star.speed;


        /*
          Espiral.
        */

        const angle =
            star.angle +
            rotation +
            star.phase * 0.05;


        /*
          Radio de la estrella.
        */

        const radius =
            star.radius *
            formation;


        /*
          Ondulación de los brazos.
        */

        const wave =
            Math.sin(
                angle * 4 +
                radius * 0.006
            ) *
            radius *
            0.018;


        const finalRadius =
            radius + wave;


        /*
          Posición.
        */

        const x =
            centerX +
            Math.cos(angle) *
            finalRadius;


        const y =
            centerY +
            Math.sin(angle) *
            finalRadius *
            flatten;


        /*
          Profundidad.
        */

        const depth =
            star.depth;


        /*
          Las estrellas cercanas son mayores.
        */

        const size =
            star.size *
            (
                0.35 +
                depth * 1.75
            );


        /*
          Brillo.
        */

        const alpha =
            star.brightness *
            (
                0.08 +
                formation * 0.92
            );


        /*
          Cerca = rosa.
          Lejos = violeta.
        */

        const green =
            90 +
            depth * 130;

        const blue =
            155 +
            depth * 80;


        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                255,
                ${green},
                ${blue},
                ${alpha}
            )`;


        /*
          Solo las partículas más cercanas
          tienen glow.
        */

        if (depth > 0.82) {

            ctx.shadowBlur =
                4 + depth * 5;

            ctx.shadowColor =
                "#ff5bb8";
        }


        ctx.arc(
            x,
            y,
            size,
            0,
            Math.PI * 2
        );


        ctx.fill();

    }


    ctx.shadowBlur = 0;


    /*
      NÚCLEO DE LA GALAXIA
    */

    const coreRadius =
        Math.min(W, H) * 0.34;


    const core =
        ctx.createRadialGradient(

            centerX,
            centerY,
            0,

            centerX,
            centerY,
            coreRadius

        );


    core.addColorStop(
        0,
        `rgba(255, 245, 252, ${0.32 * formation})`
    );

    core.addColorStop(
        0.05,
        `rgba(255, 205, 238, ${0.27 * formation})`
    );

    core.addColorStop(
        0.14,
        `rgba(255, 105, 205, ${0.16 * formation})`
    );

    core.addColorStop(
        0.35,
        `rgba(220, 35, 165, ${0.06 * formation})`
    );

    core.addColorStop(
        1,
        "rgba(255, 0, 150, 0)"
    );


    ctx.fillStyle =
        core;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /*
      Pequeño punto central.
    */

    if (formation > 0.7) {

        ctx.beginPath();

        ctx.fillStyle =
            `rgba(
                255,
                235,
                250,
                ${0.7 * formation}
            )`;

        ctx.shadowBlur = 18;

        ctx.shadowColor =
            "#ff9bd7";


        ctx.arc(
            centerX,
            centerY,
            1.5 + formation,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 0;
    }

}


/* =========================================================
   ESTRELLAS DEL PRIMER PLANO
========================================================= */

function drawForeground(time) {

    if (!started) {
        return;
    }


    for (const star of foregroundStars) {

        star.phase += star.speed;


        const pulse =
            0.55 +
            Math.sin(star.phase) * 0.35;


        const x =
            star.x +
            smoothX *
            42 *
            star.depth;

        const y =
            star.y +
            smoothY *
            24 *
            star.depth;


        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                255,
                180,
                230,
                ${0.08 + pulse * 0.4}
            )`;


        ctx.shadowBlur =
            star.depth * 7;


        ctx.shadowColor =
            "#ff65bb";


        ctx.arc(

            x,
            y,

            star.size *
            star.depth,

            0,
            Math.PI * 2

        );


        ctx.fill();

    }


    ctx.shadowBlur = 0;
}


/* =========================================================
   ESTRELLAS FUGACES
========================================================= */

function drawShootingStars() {

    if (!started) {
        return;
    }


    for (let i = 0; i < shootingStars.length; i++) {

        const meteor =
            shootingStars[i];


        if (meteor.delay > 0) {

            meteor.delay -= 0.016;

            continue;
        }


        meteor.x += meteor.speed;

        meteor.y += meteor.speed * 0.34;

        meteor.alpha -= 0.008;


        /*
          Cola.
        */

        const tail =
            ctx.createLinearGradient(

                meteor.x,
                meteor.y,

                meteor.x - meteor.length,
                meteor.y - meteor.length * 0.34

            );


        tail.addColorStop(
            0,
            `rgba(
                255,
                255,
                255,
                ${meteor.alpha}
            )`
        );

        tail.addColorStop(
            0.18,
            `rgba(
                255,
                195,
                235,
                ${meteor.alpha * 0.85}
            )`
        );

        tail.addColorStop(
            0.55,
            `rgba(
                255,
                70,
                190,
                ${meteor.alpha * 0.38}
            )`
        );

        tail.addColorStop(
            1,
            "rgba(255, 0, 150, 0)"
        );


        ctx.beginPath();

        ctx.strokeStyle = tail;

        ctx.lineWidth =
            meteor.width;


        ctx.moveTo(
            meteor.x,
            meteor.y
        );


        ctx.lineTo(

            meteor.x -
                meteor.length,

            meteor.y -
                meteor.length * 0.34

        );


        ctx.stroke();


        /*
          Cabeza brillante.
        */

        ctx.beginPath();

        ctx.fillStyle =
            `rgba(
                255,
                245,
                255,
                ${meteor.alpha}
            )`;

        ctx.shadowBlur = 15;

        ctx.shadowColor =
            "#ff8bce";


        ctx.arc(
            meteor.x,
            meteor.y,
            1.8,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 0;


        /*
          Reiniciar.
        */

        if (
            meteor.alpha <= 0 ||
            meteor.x > W + 250 ||
            meteor.y > H + 180
        ) {

            shootingStars[i] =
                createShootingStar(false);

        }
    }
}


/* =========================================================
   ANIMACIÓN
========================================================= */

function animate(timestamp) {

    const time =
        timestamp * 0.001;


    /*
      Movimiento suave de cámara.
    */

    smoothX +=
        (
            mouseX -
            smoothX
        ) * 0.025;


    smoothY +=
        (
            mouseY -
            smoothY
        ) * 0.025;


    drawBackground(time);

    drawBackgroundStars(time);

    drawGalaxy(time);

    drawForeground(time);

    drawShootingStars();


    requestAnimationFrame(
        animate
    );
}


/* =========================================================
   ENTRAR
========================================================= */

const enter =
    document.getElementById("enter");


if (enter) {

    enter.addEventListener(
        "click",
        async function () {

            if (started) {
                return;
            }


            started = true;

            startTime =
                performance.now() * 0.001;


            /*
              Música.
            */

            const music =
                document.getElementById("music");


            if (music) {

                music.volume = 0.55;

                try {

                    await music.play();

                } catch (error) {

                    console.log(
                        "Audio bloqueado por el navegador."
                    );

                }
            }


            /*
              Ocultar portada.
            */

            const intro =
                document.getElementById("intro");


            if (intro) {

                intro.classList.add(
                    "hide"
                );
            }


            /*
              Mostrar título.
            */

            const title =
                document.getElementById("topTitle");


            if (title) {

                title.classList.add(
                    "show"
                );
            }

        }
    );
}


/* =========================================================
   PARALLAX — MOUSE
========================================================= */

window.addEventListener(
    "pointermove",
    function (event) {

        if (
            event.pointerType ===
            "touch"
        ) {
            return;
        }


        mouseX =
            (
                event.clientX -
                W / 2
            ) /
            (W / 2);


        mouseY =
            (
                event.clientY -
                H / 2
            ) /
            (H / 2);

    },
    {
        passive: true
    }
);


/* =========================================================
   PARALLAX — CELULAR
========================================================= */

window.addEventListener(
    "touchmove",
    function (event) {

        if (
            !event.touches.length
        ) {
            return;
        }


        const touch =
            event.touches[0];


        mouseX =
            (
                touch.clientX -
                W / 2
            ) /
            (W / 2);


        mouseY =
            (
                touch.clientY -
                H / 2
            ) /
            (H / 2);

    },
    {
        passive: true
    }
);


/* =========================================================
   INICIO
========================================================= */

resize();

requestAnimationFrame(
    animate
);
