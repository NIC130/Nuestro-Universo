"use strict";

/* =========================================================
   NUESTRO UNIVERSO
   GALAXIA VIVA — VERSIÓN 4
   Paleta: azul + violeta + magenta + rosa
========================================================= */

const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;
let DPR = 1;

let started = false;
let startTime = 0;

let bgStars = [];
let galaxyStars = [];
let galaxyDust = [];
let foregroundStars = [];
let shootingStars = [];

let targetX = 0;
let targetY = 0;
let cameraX = 0;
let cameraY = 0;

/* =========================================================
   FRASES — ESTRELLAS FUGACES
========================================================= */

const lovePhrases = [
    "Tu existencia, fue lo más bonito que le pudo pasar a la mía.",
    "Me encanta absolutamente todo de ti.",
    "Contigo todo siempre es más lindo.",
    "Eres lo más bonito de este mundo.",
    "Te elegiría una y mil veces."
];

let currentPhrase = 0;
let phraseSequenceStarted = false;
let phraseStar = null;
let phraseTimer = null;


/* =========================================================
   FUNCIONES DE LAS FRASES
========================================================= */

function getMessageElement() {
    return document.getElementById("message");
}


function setPhraseText(text) {

    const message =
        getMessageElement();

    if (!message) return;


    const textElement =
        message.querySelector(".text") ||
        message.querySelector(".main");


    if (textElement) {

        textElement.innerHTML =
            `“${text}”`;

    } else {

        message.innerHTML = `
            <div class="label">
                MI MENSAJE PARA TI
            </div>

            <div class="text">
                “${text}”
            </div>

            <div class="heart">
                ♡
            </div>
        `;

    }

}


function hidePhrase() {

    const message =
        getMessageElement();

    if (message) {

        message.classList.remove(
            "show"
        );

    }

}


function showPhrase() {

    const message =
        getMessageElement();

    if (message) {

        message.classList.add(
            "show"
        );

    }

}


/* =========================================================
   CREAR ESTRELLA ESPECIAL
========================================================= */

function createPhraseStar() {

    return {

        progress: 0,

        duration: 1500,

        startX:
            W * 0.94,

        startY:
            H * 0.08,

        endX:
            W * 0.52,

        endY:
            H * 0.53,

        length:
            Math.min(W, H) * 0.22,

        alpha: 0,

        active: true,

        revealed: false

    };

}


/* =========================================================
   DIBUJAR ESTRELLA DE LA FRASE
========================================================= */

function drawPhraseStar() {

    if (
        !phraseStar ||
        !phraseStar.active
    ) {

        return;

    }


    const s =
        phraseStar;


    const p =
        clamp(
            s.progress,
            0,
            1
        );


    const eased =
        easeOutCubic(p);


    const x =
        s.startX +
        (
            s.endX -
            s.startX
        ) *
        eased;


    const y =
        s.startY +
        (
            s.endY -
            s.startY
        ) *
        eased;


    const dx =
        s.endX -
        s.startX;


    const dy =
        s.endY -
        s.startY;


    const distance =
        Math.hypot(
            dx,
            dy
        ) || 1;


    const ux =
        dx / distance;


    const uy =
        dy / distance;


    const tailX =
        x -
        ux *
        s.length;


    const tailY =
        y -
        uy *
        s.length;


    /*
      Cola azul → violeta → rosa
    */

    const trail =
        ctx.createLinearGradient(

            tailX,
            tailY,

            x,
            y

        );


    trail.addColorStop(
        0,
        "rgba(70,100,255,0)"
    );


    trail.addColorStop(
        0.45,
        `rgba(
            135,
            95,
            255,
            ${s.alpha * 0.28}
        )`
    );


    trail.addColorStop(
        0.78,
        `rgba(
            255,
            95,
            215,
            ${s.alpha * 0.62}
        )`
    );


    trail.addColorStop(
        1,
        `rgba(
            255,
            245,
            255,
            ${s.alpha}
        )`
    );


    ctx.beginPath();

    ctx.strokeStyle =
        trail;

    ctx.lineWidth =
        2.2;

    ctx.moveTo(
        tailX,
        tailY
    );

    ctx.lineTo(
        x,
        y
    );

    ctx.stroke();


    /*
      Brillo de la estrella
    */

    ctx.beginPath();

    ctx.fillStyle =
        `rgba(
            255,
            235,
            252,
            ${s.alpha}
        )`;


    ctx.shadowBlur =
        24;


    ctx.shadowColor =
        "#ff79d4";


    ctx.arc(

        x,
        y,

        2.3 +
        p * 1.2,

        0,
        Math.PI * 2

    );


    ctx.fill();


    ctx.shadowBlur = 0;


    /*
      Partículas que deja atrás
    */

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const t =
            i / 8;


        const px =
            x -
            ux *
            s.length *
            t;


        const py =
            y -
            uy *
            s.length *
            t;


        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                ${190 + i * 7},
                ${150 + i * 5},
                255,
                ${s.alpha *
                    (1 - t) *
                    0.45}
            )`;


        ctx.arc(

            px +
            Math.sin(i * 8.1) * 2,

            py +
            Math.cos(i * 5.7) * 2,

            0.7 +
            (1 - t) * 0.7,

            0,
            Math.PI * 2

        );


        ctx.fill();

    }

}


/* =========================================================
   INICIAR FRASES
========================================================= */

function startLovePhrases() {

    if (
        phraseSequenceStarted
    ) {

        return;

    }


    phraseSequenceStarted =
        true;


    currentPhrase =
        0;


    hidePhrase();


    /*
      Espera para que primero
      disfrutemos la galaxia.
    */

    setTimeout(
        () => {

            launchNextPhrase();

        },
        1800
    );

}


/* =========================================================
   SIGUIENTE FRASE
========================================================= */

function launchNextPhrase() {

    if (
        currentPhrase >=
        lovePhrases.length
    ) {

        phraseSequenceStarted =
            false;

        phraseStar =
            null;

        return;

    }


    hidePhrase();


    setPhraseText(
        lovePhrases[
            currentPhrase
        ]
    );


    phraseStar =
        createPhraseStar();


    const start =
        performance.now();


    const duration =
        phraseStar.duration;


    function animatePhraseStar(
        now
    ) {

        if (!phraseStar) {

            return;

        }


        phraseStar.progress =
            (
                now -
                start
            ) /
            duration;


        /*
          Aparición.
        */

        if (
            phraseStar.progress <
            0.18
        ) {

            phraseStar.alpha =
                phraseStar.progress /
                0.18;

        }

        /*
          Brillo máximo.
        */

        else if (
            phraseStar.progress <
            0.78
        ) {

            phraseStar.alpha =
                1;

        }

        /*
          Desaparición.
        */

        else {

            phraseStar.alpha =
                1 -
                (
                    phraseStar.progress -
                    0.78
                ) /
                0.22;

        }


        /*
          La frase aparece cuando
          la estrella ya está cerca
          del centro.
        */

        if (
            phraseStar.progress >=
            0.62 &&
            !phraseStar.revealed
        ) {

            phraseStar.revealed =
                true;

            showPhrase();

        }


        if (
            phraseStar.progress <
            1
        ) {

            requestAnimationFrame(
                animatePhraseStar
            );

        }

        else {

            phraseStar.active =
                false;


            /*
              Tiempo que permanece
              visible la frase.
            */

            phraseTimer =
                setTimeout(
                    () => {

                        hidePhrase();


                        currentPhrase++;


                        setTimeout(
                            () => {

                                launchNextPhrase();

                            },
                            900
                        );

                    },
                    4100
                );

        }

    }


    requestAnimationFrame(
        animatePhraseStar
    );

}


/* =========================================================
   UTILIDADES
========================================================= */

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}


/* =========================================================
   CANVAS
========================================================= */

function resize() {

    W = window.innerWidth;
    H = window.innerHeight;

    DPR = Math.min(
        window.devicePixelRatio || 1,
        2
    );

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

    bgStars = [];
    galaxyStars = [];
    galaxyDust = [];
    foregroundStars = [];
    shootingStars = [];


    /* =====================================================
       ESTRELLAS DEL FONDO
    ===================================================== */

    const backgroundAmount =
        W < 600 ? 500 : 800;

    for (let i = 0; i < backgroundAmount; i++) {

        bgStars.push({

            x: Math.random() * W,
            y: Math.random() * H,

            size: random(0.15, 1.15),

            alpha: random(0.18, 0.75),

            depth: random(0.05, 0.35),

            phase: random(0, Math.PI * 2),

            twinkle: random(0.004, 0.018)

        });

    }


    /* =====================================================
       GALAXIA
    ===================================================== */

    const galaxyAmount =
        W < 600 ? 4200 : 6500;

    const arms = 4;


    for (let i = 0; i < galaxyAmount; i++) {

        const normalized =
            Math.pow(
                Math.random(),
                0.68
            );


        const radius =
            normalized *
            Math.min(W, H) *
            0.86;


        const arm =
            Math.floor(
                Math.random() * arms
            );


        const armBase =
            (
                Math.PI * 2 / arms
            ) * arm;


        const curve =
            radius * 0.012;


        /*
          Los brazos siguen definidos,
          pero tienen una ligera dispersión.
        */

        const spread =
            random(-0.095, 0.095) *
            (
                0.35 +
                normalized
            );


        galaxyStars.push({

            radius,

            angle:
                armBase +
                curve +
                spread,

            arm,

            depth:
                random(0.15, 1),

            size:
                random(0.25, 1.45),

            brightness:
                random(0.35, 1),

            speed:
                random(
                    0.00003,
                    0.00022
                ),

            phase:
                random(
                    0,
                    Math.PI * 2
                )

        });

    }


    /* =====================================================
       POLVO CÓSMICO
    ===================================================== */

    const dustAmount =
        W < 600 ? 1100 : 1700;


    for (let i = 0; i < dustAmount; i++) {

        const radius =
            Math.pow(
                Math.random(),
                0.72
            ) *
            Math.min(W, H) *
            0.82;


        const arm =
            Math.floor(
                Math.random() * arms
            );


        const armBase =
            (
                Math.PI * 2 / arms
            ) * arm;


        const curve =
            radius * 0.012;


        const spread =
            random(
                -0.17,
                0.17
            );


        galaxyDust.push({

            radius,

            angle:
                armBase +
                curve +
                spread,

            depth:
                random(0.1, 0.9),

            size:
                random(0.4, 2.8),

            alpha:
                random(0.015, 0.11),

            speed:
                random(
                    0.00002,
                    0.00012
                )

        });

    }


    /* =====================================================
       ESTRELLAS EN PRIMER PLANO
    ===================================================== */

    const foregroundAmount =
        W < 600 ? 380 : 650;


    for (let i = 0; i < foregroundAmount; i++) {

        foregroundStars.push({

            x:
                Math.random() * W,

            y:
                Math.random() * H,

            size:
                random(0.4, 2.3),

            depth:
                random(0.5, 1),

            alpha:
                random(0.15, 0.8),

            phase:
                random(
                    0,
                    Math.PI * 2
                )

        });

    }


    /* =====================================================
       ESTRELLAS FUGACES
    ===================================================== */

    for (let i = 0; i < 6; i++) {

        shootingStars.push(
            createShootingStar(true)
        );

    }

}


/* =========================================================
   ESTRELLA FUGAZ
========================================================= */

function createShootingStar(initial = false) {

    return {

        x:
            initial
                ? random(-W, W)
                : random(-100, W),

        y:
            initial
                ? random(0, H * 0.65)
                : random(-120, H * 0.55),

        speed:
            random(6, 13),

        length:
            random(70, 190),

        width:
            random(0.7, 1.8),

        alpha:
            initial
                ? random(0, 0.55)
                : 1,

        delay:
            initial
                ? random(0, 7)
                : random(0.5, 4),

        /*
          Cada estrella fugaz tendrá
          una tonalidad diferente.
        */

        hue:
            Math.random()

    };

}


/* =========================================================
   FONDO
========================================================= */

function drawBackground(time) {

    const cx =
        W * 0.5 +
        cameraX * 10;

    const cy =
        H * 0.48 +
        cameraY * 7;


    /*
      AZUL PROFUNDO → VIOLETA → NEGRO
    */

    const bg =
        ctx.createRadialGradient(

            cx,
            cy,
            0,

            cx,
            cy,
            Math.max(W, H)

        );


    bg.addColorStop(
        0,
        "#171044"
    );

    bg.addColorStop(
        0.16,
        "#130b36"
    );

    bg.addColorStop(
        0.35,
        "#0b0926"
    );

    bg.addColorStop(
        0.62,
        "#050719"
    );

    bg.addColorStop(
        0.82,
        "#02040e"
    );

    bg.addColorStop(
        1,
        "#000106"
    );


    ctx.fillStyle = bg;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* =====================================================
       NEBULOSAS
    ===================================================== */

    const pulse =
        Math.sin(
            time * 0.17
        ) * 0.5 + 0.5;


    /*
      Violeta azulada.
    */

    drawNebula(
        W * 0.20 + cameraX * 20,
        H * 0.35 + cameraY * 10,
        Math.min(W, H) * 0.48,

        `rgba(
            65,
            55,
            210,
            ${0.055 + pulse * 0.015}
        )`
    );


    /*
      Magenta.
    */

    drawNebula(
        W * 0.76 + cameraX * 14,
        H * 0.57 + cameraY * 8,
        Math.min(W, H) * 0.55,

        `rgba(
            215,
            35,
            175,
            ${0.045 + pulse * 0.012}
        )`
    );


    /*
      Azul profundo.
    */

    drawNebula(
        W * 0.48,
        H * 0.18,
        Math.min(W, H) * 0.38,

        "rgba(35,80,210,0.045)"
    );


    /*
      Pequeño toque rosa.
    */

    drawNebula(
        W * 0.52,
        H * 0.72,
        Math.min(W, H) * 0.32,

        "rgba(255,55,185,0.025)"
    );

}


/* =========================================================
   NEBULOSA
========================================================= */

function drawNebula(
    x,
    y,
    radius,
    color
) {

    const gradient =
        ctx.createRadialGradient(

            x,
            y,
            0,

            x,
            y,
            radius

        );


    gradient.addColorStop(
        0,
        color
    );

    gradient.addColorStop(
        0.35,
        color
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        gradient;

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

    for (
        const star of bgStars
    ) {

        star.phase +=
            star.twinkle;


        const pulse =
            0.55 +
            Math.sin(
                star.phase
            ) * 0.35;


        const x =
            star.x +
            cameraX *
            18 *
            star.depth;


        const y =
            star.y +
            cameraY *
            12 *
            star.depth;


        /*
          Algunas estrellas son azuladas,
          otras blancas y otras ligeramente rosas.
        */

        let color;


        const variation =
            Math.random();


        if (variation < 0.28) {

            color =
                `rgba(
                    110,
                    175,
                    255,
                    ${star.alpha * pulse}
                )`;

        } else if (variation < 0.55) {

            color =
                `rgba(
                    225,
                    210,
                    255,
                    ${star.alpha * pulse}
                )`;

        } else {

            color =
                `rgba(
                    255,
                    220,
                    245,
                    ${star.alpha * pulse}
                )`;

        }


        ctx.beginPath();

        ctx.fillStyle =
            color;


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
      Entrada progresiva.
    */

    const introProgress =
        clamp(
            elapsed / 4.5,
            0,
            1
        );


    const formation =
        easeOutCubic(
            introProgress
        );


    /*
      Rotación lenta.
    */

    const rotation =
        time * 0.014;


    const cx =
        W * 0.5 +
        cameraX * 15;

    const cy =
        H * 0.48 +
        cameraY * 9;


    /*
      Inclinación.
    */

    const tilt =
        W < 600
            ? 0.34
            : 0.29;


    /* =====================================================
       POLVO DE LOS BRAZOS
    ===================================================== */

    for (
        const dust of galaxyDust
    ) {

        dust.angle +=
            dust.speed;


        const radius =
            dust.radius *
            formation;


        const angle =
            dust.angle +
            rotation;


        const x =
            cx +
            Math.cos(angle) *
            radius;


        const y =
            cy +
            Math.sin(angle) *
            radius *
            tilt;


        /*
          Mezcla violeta/magenta.
        */

        const colorChoice =
            dust.depth > 0.55;


        ctx.beginPath();


        ctx.fillStyle =
            colorChoice

                ? `rgba(
                    190,
                    65,
                    210,
                    ${dust.alpha * formation}
                  )`

                : `rgba(
                    70,
                    100,
                    220,
                    ${dust.alpha * formation}
                  )`;


        ctx.arc(

            x,
            y,

            dust.size *
            (
                0.5 +
                dust.depth
            ),

            0,
            Math.PI * 2

        );


        ctx.fill();

    }


    /* =====================================================
       ESTRELLAS DE LA GALAXIA
    ===================================================== */

    for (
        const star of galaxyStars
    ) {

        star.phase +=
            star.speed;


        const radius =
            star.radius *
            formation;


        /*
          Curvatura espiral.
        */

        const spiral =
            star.angle +
            rotation +
            radius *
            0.0024;


        /*
          Pequeña irregularidad.
        */

        const wave =
            Math.sin(
                radius * 0.008 +
                star.arm * 1.7
            ) *
            radius *
            0.012;


        const finalRadius =
            radius +
            wave;


        const x =
            cx +
            Math.cos(spiral) *
            finalRadius;


        const y =
            cy +
            Math.sin(spiral) *
            finalRadius *
            tilt;


        const depth =
            star.depth;


        const size =
            star.size *
            (
                0.45 +
                depth * 1.6
            );


        const alpha =
            star.brightness *
            formation;


        /*
          Paleta de la galaxia.

          Azul:
          estrellas lejanas.

          Violeta:
          estrellas medias.

          Rosa:
          estrellas cercanas.

          Blanco:
          estrellas más brillantes.
        */

        let red;
        let green;
        let blue;


        if (depth < 0.32) {

            red = 105;
            green = 125;
            blue = 255;

        } else if (depth < 0.60) {

            red = 175;
            green = 105;
            blue = 245;

        } else if (depth < 0.82) {

            red = 245;
            green = 105;
            blue = 220;

        } else {

            red = 255;
            green = 205;
            blue = 245;

        }


        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                ${red},
                ${green},
                ${blue},
                ${alpha}
            )`;


        /*
          Glow solamente para
          las estrellas cercanas.
        */

        if (
            depth > 0.82 &&
            star.brightness > 0.7
        ) {

            ctx.shadowBlur =
                3 +
                depth * 5;

            ctx.shadowColor =
                "#ff72cf";

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


    /* =====================================================
       HALO DE LA GALAXIA
    ===================================================== */

    const haloRadius =
        Math.min(W, H) *
        0.52;


    const halo =
        ctx.createRadialGradient(

            cx,
            cy,
            Math.min(W, H) * 0.04,

            cx,
            cy,
            haloRadius

        );


    halo.addColorStop(
        0,
        `rgba(
            255,
            180,
            245,
            ${0.07 * formation}
        )`
    );


    halo.addColorStop(
        0.18,
        `rgba(
            210,
            85,
            235,
            ${0.045 * formation}
        )`
    );


    halo.addColorStop(
        0.45,
        `rgba(
            75,
            85,
            220,
            ${0.025 * formation}
        )`
    );


    halo.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        halo;


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* =====================================================
       NÚCLEO
    ===================================================== */

    const coreRadius =
        Math.min(W, H) *
        0.34;


    const core =
        ctx.createRadialGradient(

            cx,
            cy,
            0,

            cx,
            cy,
            coreRadius

        );


    /*
      Blanco.
    */

    core.addColorStop(
        0,
        `rgba(
            255,
            250,
            255,
            ${0.40 * formation}
        )`
    );


    /*
      Rosa claro.
    */

    core.addColorStop(
        0.035,
        `rgba(
            255,
            215,
            246,
            ${0.32 * formation}
        )`
    );


    /*
      Magenta.
    */

    core.addColorStop(
        0.11,
        `rgba(
            255,
            105,
            215,
            ${0.18 * formation}
        )`
    );


    /*
      Violeta.
    */

    core.addColorStop(
        0.25,
        `rgba(
            145,
            55,
            215,
            ${0.075 * formation}
        )`
    );


    /*
      Azul.
    */

    core.addColorStop(
        0.48,
        `rgba(
            50,
            70,
            190,
            ${0.025 * formation}
        )`
    );


    core.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        core;


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* =====================================================
       PUNTO CENTRAL
    ===================================================== */

    if (
        formation > 0.6
    ) {

        const glow =
            0.68 +
            Math.sin(
                time * 1.5
            ) * 0.15;


        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                255,
                240,
                252,
                ${glow}
            )`;


        ctx.shadowBlur =
            26;

        ctx.shadowColor =
            "#ff9edc";


        ctx.arc(
            cx,
            cy,
            1.5 +
            formation * 1.8,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.shadowBlur = 0;

    }

}


/* =========================================================
   ESTRELLAS CERCANAS
========================================================= */

function drawForeground(time) {

    if (!started) {
        return;
    }


    for (
        const star of foregroundStars
    ) {

        star.phase +=
            0.004;


        const pulse =
            0.6 +
            Math.sin(
                star.phase
            ) * 0.3;


        const x =
            star.x +
            cameraX *
            45 *
            star.depth;


        const y =
            star.y +
            cameraY *
            28 *
            star.depth;


        /*
          Mezcla azul, blanco y rosa.
        */

        let color;


        if (
            star.depth < 0.68
        ) {

            color =
                `rgba(
                    150,
                    190,
                    255,
                    ${star.alpha * pulse}
                )`;

        } else {

            color =
                `rgba(
                    255,
                    195,
                    235,
                    ${star.alpha * pulse}
                )`;

        }


        ctx.beginPath();


        ctx.fillStyle =
            color;


        ctx.shadowBlur =
            star.depth * 7;


        ctx.shadowColor =
            star.depth < 0.68
                ? "#729cff"
                : "#ff68c4";


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


    for (
        let i = 0;
        i < shootingStars.length;
        i++
    ) {

        const s =
            shootingStars[i];


        if (
            s.delay > 0
        ) {

            s.delay -=
                0.016;

            continue;

        }


        s.x +=
            s.speed;


        s.y +=
            s.speed *
            0.32;


        s.alpha -=
            0.009;


        /*
          Alternamos azul, rosa y blanco.
        */

        let headColor;
        let middleColor;


        if (
            s.hue < 0.33
        ) {

            headColor =
                `rgba(
                    225,
                    245,
                    255,
                    ${s.alpha}
                )`;

            middleColor =
                `rgba(
                    90,
                    155,
                    255,
                    ${s.alpha * 0.65}
                )`;

        } else if (
            s.hue < 0.66
        ) {

            headColor =
                `rgba(
                    255,
                    245,
                    255,
                    ${s.alpha}
                )`;

            middleColor =
                `rgba(
                    255,
                    120,
                    220,
                    ${s.alpha * 0.65}
                )`;

        } else {

            headColor =
                `rgba(
                    255,
                    255,
                    255,
                    ${s.alpha}
                )`;

            middleColor =
                `rgba(
                    185,
                    105,
                    255,
                    ${s.alpha * 0.65}
                )`;

        }


        /*
          Cola.
        */

        const trail =
            ctx.createLinearGradient(

                s.x,
                s.y,

                s.x -
                    s.length,

                s.y -
                    s.length *
                    0.32

            );


        trail.addColorStop(
            0,
            headColor
        );


        trail.addColorStop(
            0.18,
            middleColor
        );


        trail.addColorStop(
            0.55,
            `rgba(
                120,
                80,
                230,
                ${s.alpha * 0.3}
            )`
        );


        trail.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );


        ctx.beginPath();


        ctx.strokeStyle =
            trail;


        ctx.lineWidth =
            s.width;


        ctx.moveTo(
            s.x,
            s.y
        );


        ctx.lineTo(

            s.x -
                s.length,

            s.y -
                s.length *
                0.32

        );


        ctx.stroke();


        /*
          Cabeza.
        */

        ctx.beginPath();


        ctx.fillStyle =
            headColor;


        ctx.shadowBlur =
            15;


        ctx.shadowColor =
            s.hue < 0.33
                ? "#65a9ff"
                : "#ff8bd5";


        ctx.arc(
            s.x,
            s.y,
            1.7,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.shadowBlur = 0;


        /*
          Reiniciar.
        */

        if (
            s.alpha <= 0 ||
            s.x > W + 250 ||
            s.y > H + 200
        ) {

            shootingStars[i] =
                createShootingStar(
                    false
                );

        }

    }

}


/* =========================================================
   ANIMACIÓN PRINCIPAL
========================================================= */

function animate(timestamp) {

    const time =
        timestamp * 0.001;


    /*
      Movimiento suave de cámara.
    */

    cameraX +=
        (
            targetX -
            cameraX
        ) * 0.025;


    cameraY +=
        (
            targetY -
            cameraY
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
   BOTÓN ENTRAR
========================================================= */

const enterButton =
    document.getElementById(
        "enter"
    );


if (
    enterButton
) {
setTimeout(() => {

    startLovePhrases();

}, 6500);
    enterButton.addEventListener(
        "click",
        async function () {

            if (
                started
            ) {
                return;
            }


            started = true;


            startTime =
                performance.now() *
                0.001;


            /*
              Música.
            */

            const music =
                document.getElementById(
                    "music"
                );


            if (
                music
            ) {

                music.volume =
                    0.55;


                try {

                    await music.play();

                } catch (error) {

                    console.log(
                        "El navegador bloqueó el audio."
                    );

                }

            }


            /*
              Ocultar portada.
            */

            const intro =
                document.getElementById(
                    "intro"
                );


            if (
                intro
            ) {

                intro.classList.add(
                    "hide"
                );

            }


            /*
              Mostrar título.
            */

            const title =
                document.getElementById(
                    "topTitle"
                );


            if (
                title
            ) {

                title.classList.add(
                    "show"
                );

            }

        }
    );

}


/* =========================================================
   PARALLAX — COMPUTADORA
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


        targetX =
            (
                event.clientX -
                W / 2
            ) /
            (W / 2);


        targetY =
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


        targetX =
            (
                touch.clientX -
                W / 2
            ) /
            (W / 2);


        targetY =
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
   INICIAR
========================================================= */

resize();

requestAnimationFrame(
    animate
);
