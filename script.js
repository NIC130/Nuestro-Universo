"use strict";

/* =========================================================
   NUESTRO UNIVERSO
   GALAXIA VIVA — VERSIÓN 3
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

window.addEventListener(
    "resize",
    resize
);


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
       ESTRELLAS LEJANAS
    ===================================================== */

    const backgroundAmount =
        W < 600 ? 500 : 800;

    for (
        let i = 0;
        i < backgroundAmount;
        i++
    ) {

        bgStars.push({

            x: Math.random() * W,
            y: Math.random() * H,

            size: random(.15, 1.15),

            alpha: random(.18, .75),

            depth: random(.05, .35),

            phase: random(
                0,
                Math.PI * 2
            ),

            twinkle: random(
                .004,
                .018
            )

        });

    }


    /* =====================================================
       GALAXIA — ESTRELLAS
    ===================================================== */

    const galaxyAmount =
        W < 600 ? 4200 : 6500;

    const arms = 4;


    for (
        let i = 0;
        i < galaxyAmount;
        i++
    ) {

        /*
          Distribución radial.

          El centro tiene mucha densidad,
          pero los extremos siguen siendo visibles.
        */

        const normalized =
            Math.pow(
                Math.random(),
                0.68
            );


        const radius =
            normalized *
            Math.min(W, H) *
            0.86;


        /*
          Elegimos uno de los cuatro brazos.
        */

        const arm =
            Math.floor(
                Math.random() * arms
            );


        /*
          Separación angular
          entre los brazos.
        */

        const armBase =
            (
                Math.PI * 2 / arms
            ) * arm;


        /*
          Curvatura.

          Cuanto más lejos del centro,
          más gira el brazo.
        */

        const curve =
            radius *
            0.012;


        /*
          El ruido es pequeño.

          Esto mantiene los brazos
          visibles.
        */

        const spread =
            random(
                -.095,
                .095
            ) *
            (
                .35 +
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
                random(.15, 1),

            size:
                random(.25, 1.45),

            brightness:
                random(.35, 1),

            speed:
                random(
                    .00003,
                    .00022
                ),

            phase:
                random(
                    0,
                    Math.PI * 2
                )

        });

    }


    /* =====================================================
       POLVO DE LOS BRAZOS
    ===================================================== */

    const dustAmount =
        W < 600 ? 1100 : 1700;


    for (
        let i = 0;
        i < dustAmount;
        i++
    ) {

        const radius =
            Math.pow(
                Math.random(),
                .72
            ) *
            Math.min(W, H) *
            .82;


        const arm =
            Math.floor(
                Math.random() * arms
            );


        const armBase =
            (
                Math.PI * 2 / arms
            ) * arm;


        const curve =
            radius *
            0.012;


        const spread =
            random(
                -.17,
                .17
            );


        galaxyDust.push({

            radius,

            angle:
                armBase +
                curve +
                spread,

            depth:
                random(.1, .9),

            size:
                random(.4, 2.8),

            alpha:
                random(.015, .11),

            speed:
                random(
                    .00002,
                    .00012
                )

        });

    }


    /* =====================================================
       PRIMER PLANO
    ===================================================== */

    const foregroundAmount =
        W < 600 ? 380 : 650;


    for (
        let i = 0;
        i < foregroundAmount;
        i++
    ) {

        foregroundStars.push({

            x:
                Math.random() * W,

            y:
                Math.random() * H,

            size:
                random(.4, 2.3),

            depth:
                random(.5, 1),

            alpha:
                random(.15, .8),

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

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        shootingStars.push(
            createShootingStar(true)
        );

    }

}


/* =========================================================
   ESTRELLA FUGAZ
========================================================= */

function createShootingStar(
    initial = false
) {

    return {

        x:
            initial
                ? random(
                    -W,
                    W
                )
                : random(
                    -100,
                    W
                ),

        y:
            initial
                ? random(
                    0,
                    H * .65
                )
                : random(
                    -120,
                    H * .55
                ),

        speed:
            random(
                6,
                13
            ),

        length:
            random(
                70,
                190
            ),

        width:
            random(
                .7,
                1.8
            ),

        alpha:
            initial
                ? random(
                    0,
                    .55
                )
                : 1,

        delay:
            initial
                ? random(
                    0,
                    7
                )
                : random(
                    .5,
                    4
                )

    };

}


/* =========================================================
   FONDO
========================================================= */

function drawBackground(
    time
) {

    const cx =
        W * .5 +
        cameraX * 10;

    const cy =
        H * .48 +
        cameraY * 7;


    /*
      Negro profundo.
    */

    const bg =
        ctx.createRadialGradient(

            cx,
            cy,
            0,

            cx,
            cy,
            Math.max(
                W,
                H
            )

        );


    bg.addColorStop(
        0,
        "#26001f"
    );

    bg.addColorStop(
        .18,
        "#170012"
    );

    bg.addColorStop(
        .42,
        "#090008"
    );

    bg.addColorStop(
        .72,
        "#030004"
    );

    bg.addColorStop(
        1,
        "#000001"
    );


    ctx.fillStyle =
        bg;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /*
      Nebulosa irregular.

      Varias luces desplazadas,
      en vez de un círculo perfecto.
    */

    const pulse =
        Math.sin(
            time * .17
        ) * .5 + .5;


    drawNebula(
        W * .25 + cameraX * 20,
        H * .38 + cameraY * 10,
        Math.min(W, H) * .45,
        `rgba(160,20,130,${.045 + pulse * .015})`
    );


    drawNebula(
        W * .72 + cameraX * 14,
        H * .58 + cameraY * 8,
        Math.min(W, H) * .52,
        `rgba(255,35,170,${.035 + pulse * .012})`
    );


    drawNebula(
        W * .48,
        H * .22,
        Math.min(W, H) * .35,
        "rgba(90,20,150,.035)"
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
        .35,
        color
    );

    gradient.addColorStop(
        1,
        "rgba(255,0,150,0)"
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

function drawBackgroundStars(
    time
) {

    for (
        const star of bgStars
    ) {

        star.phase +=
            star.twinkle;


        const pulse =
            .55 +
            Math.sin(
                star.phase
            ) * .35;


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


        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                255,
                225,
                245,
                ${star.alpha * pulse}
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
   GALAXIA
========================================================= */

function drawGalaxy(
    time
) {

    if (!started) {
        return;
    }


    const elapsed =
        time - startTime;


    /*
      La galaxia nace desde el centro.
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
      Rotación muy lenta.
    */

    const rotation =
        time *
        .014;


    /*
      Centro.
    */

    const cx =
        W * .5 +
        cameraX * 15;

    const cy =
        H * .48 +
        cameraY * 9;


    /*
      Perspectiva.

      La galaxia se ve ligeramente
      inclinada, como un disco.
    */

    const tilt =
        W < 600
            ? .34
            : .29;


    /* =====================================================
       POLVO
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


        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                255,
                75,
                180,
                ${dust.alpha * formation}
            )`;


        ctx.arc(

            x,
            y,

            dust.size *
            (
                .5 +
                dust.depth
            ),

            0,
            Math.PI * 2

        );


        ctx.fill();

    }


    /* =====================================================
       ESTRELLAS
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
          Curvatura adicional.

          Esto hace que cada brazo
          tenga forma de espiral.
        */

        const spiral =
            star.angle +
            rotation +
            radius *
            .0024;


        /*
          Pequeña onda.
        */

        const wave =
            Math.sin(
                radius * .008 +
                star.arm * 1.7
            ) *
            radius *
            .012;


        const finalRadius =
            radius + wave;


        const x =
            cx +
            Math.cos(
                spiral
            ) *
            finalRadius;


        const y =
            cy +
            Math.sin(
                spiral
            ) *
            finalRadius *
            tilt;


        /*
          Profundidad.
        */

        const depth =
            star.depth;


        const size =
            star.size *
            (
                .45 +
                depth * 1.6
            );


        const alpha =
            star.brightness *
            formation;


        /*
          Cerca = blanco/rosa.
          Lejos = violeta.
        */

        const green =
            105 +
            depth * 110;

        const blue =
            175 +
            depth * 65;


        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                255,
                ${green},
                ${blue},
                ${alpha}
            )`;


        /*
          Solo algunas brillan.
        */

        if (
            depth > .84 &&
            star.brightness > .7
        ) {

            ctx.shadowBlur =
                3 +
                depth * 5;

            ctx.shadowColor =
                "#ff65bd";

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
       NÚCLEO
    ===================================================== */

    const coreRadius =
        Math.min(
            W,
            H
        ) * .34;


    const core =
        ctx.createRadialGradient(

            cx,
            cy,
            0,

            cx,
            cy,
            coreRadius

        );


    core.addColorStop(
        0,
        `rgba(
            255,
            245,
            252,
            ${.32 * formation}
        )`
    );


    core.addColorStop(
        .035,
        `rgba(
            255,
            220,
            245,
            ${.27 * formation}
        )`
    );


    core.addColorStop(
        .10,
        `rgba(
            255,
            150,
            220,
            ${.18 * formation}
        )`
    );


    core.addColorStop(
        .24,
        `rgba(
            255,
            65,
            185,
            ${.07 * formation}
        )`
    );


    core.addColorStop(
        1,
        "rgba(255,0,150,0)"
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
      Núcleo blanco.
    */

    if (
        formation > .6
    ) {

        const glow =
            .6 +
            Math.sin(
                time * 1.5
            ) * .15;


        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                255,
                238,
                250,
                ${glow}
            )`;


        ctx.shadowBlur =
            24;

        ctx.shadowColor =
            "#ff9bda";


        ctx.arc(
            cx,
            cy,
            1.3 +
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

function drawForeground(
    time
) {

    if (!started) {
        return;
    }


    for (
        const star of foregroundStars
    ) {

        star.phase += .004;


        const pulse =
            .6 +
            Math.sin(
                star.phase
            ) * .3;


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


        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                255,
                190,
                230,
                ${star.alpha * pulse}
            )`;


        ctx.shadowBlur =
            star.depth *
            7;

        ctx.shadowColor =
            "#ff62bb";


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

            s.delay -= .016;

            continue;

        }


        s.x +=
            s.speed;


        s.y +=
            s.speed *
            .32;


        s.alpha -=
            .009;


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
                    .32

            );


        trail.addColorStop(
            0,
            `rgba(
                255,
                255,
                255,
                ${s.alpha}
            )`
        );


        trail.addColorStop(
            .18,
            `rgba(
                255,
                205,
                238,
                ${s.alpha * .9}
            )`
        );


        trail.addColorStop(
            .5,
            `rgba(
                255,
                80,
                190,
                ${s.alpha * .42}
            )`
        );


        trail.addColorStop(
            1,
            "rgba(255,0,150,0)"
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
                .32

        );


        ctx.stroke();


        /*
          Cabeza.
        */

        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                255,
                250,
                255,
                ${s.alpha}
            )`;


        ctx.shadowBlur =
            15;

        ctx.shadowColor =
            "#ff8bce";


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
   ANIMACIÓN
========================================================= */

function animate(
    timestamp
) {

    const time =
        timestamp * .001;


    /*
      Cámara suave.
    */

    cameraX +=
        (
            targetX -
            cameraX
        ) * .025;


    cameraY +=
        (
            targetY -
            cameraY
        ) * .025;


    drawBackground(
        time
    );

    drawBackgroundStars(
        time
    );

    drawGalaxy(
        time
    );

    drawForeground(
        time
    );

    drawShootingStars();


    requestAnimationFrame(
        animate
    );

}


/* =========================================================
   ENTRAR
========================================================= */

const enterButton =
    document.getElementById(
        "enter"
    );


if (
    enterButton
) {

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
                .001;


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
                    .55;


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
   INICIO
========================================================= */

resize();

requestAnimationFrame(
    animate
);
