"use strict";

/* =====================================================
   UNIVERSO BASE — GALAXIA VIVA
===================================================== */

const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;
let DPR = 1;

let stars = [];
let galaxy = [];
let foreground = [];
let shootingStars = [];

let started = false;
let startTime = 0;

let targetX = 0;
let targetY = 0;

let smoothX = 0;
let smoothY = 0;


/* =====================================================
   UTILIDADES
===================================================== */

function random(min, max) {
  return Math.random() * (max - min) + min;
}


/* =====================================================
   TAMAÑO DEL CANVAS
===================================================== */

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


/* =====================================================
   CREAR UNIVERSO
===================================================== */

function createUniverse() {

  stars = [];
  galaxy = [];
  foreground = [];
  shootingStars = [];


  /* ---------------------------------------------------
     ESTRELLAS LEJANAS
  --------------------------------------------------- */

  const starCount =
    W < 600 ? 420 : 650;

  for (let i = 0; i < starCount; i++) {

    stars.push({

      x: Math.random() * W,
      y: Math.random() * H,

      size: random(0.2, 1.3),

      depth: random(0.05, 0.45),

      alpha: random(0.15, 0.75),

      phase: random(0, Math.PI * 2),

      twinkle: random(0.004, 0.025)

    });

  }


  /* ---------------------------------------------------
     GALAXIA
  --------------------------------------------------- */

  const particleCount =
    W < 600 ? 1800 : 2700;


  for (let i = 0; i < particleCount; i++) {

    const angle =
      Math.random() *
      Math.PI *
      2;


    /*
      Mayor concentración
      hacia el centro.
    */

    const radius =
      Math.pow(
        Math.random(),
        0.58
      ) *
      Math.max(W, H) *
      0.67;


    galaxy.push({

      angle: angle,

      radius: radius,

      depth: random(0.05, 1),

      size: random(0.25, 1.7),

      alpha: random(0.18, 0.95),

      speed: random(0.00012, 0.0009),

      armOffset: random(-0.18, 0.18)

    });

  }


  /* ---------------------------------------------------
     PARTÍCULAS EN PRIMER PLANO
  --------------------------------------------------- */

  const foregroundCount =
    W < 600 ? 500 : 800;


  for (let i = 0; i < foregroundCount; i++) {

    foreground.push({

      x: Math.random() * W,

      y: Math.random() * H,

      size: random(0.35, 2.2),

      depth: random(0.45, 1),

      phase: random(0, Math.PI * 2)

    });

  }


  /* ---------------------------------------------------
     ESTRELLAS FUGACES
  --------------------------------------------------- */

  for (let i = 0; i < 5; i++) {

    shootingStars.push(
      createShootingStar(true)
    );

  }

}


/* =====================================================
   ESTRELLA FUGAZ
===================================================== */

function createShootingStar(initial = false) {

  return {

    x: initial
      ? random(0, W)
      : W + random(50, 250),

    y: initial
      ? random(0, H * 0.55)
      : random(-100, H * 0.45),

    speed: random(5, 11),

    length: random(70, 170),

    alpha: initial
      ? random(0, 0.7)
      : 1,

    delay: initial
      ? random(0, 6)
      : random(0, 2)

  };

}


/* =====================================================
   FONDO
===================================================== */

function drawBackground(time) {

  const centerX =
    W * 0.5 +
    smoothX * 10;

  const centerY =
    H * 0.48 +
    smoothY * 7;


  /*
    Fondo profundo.
  */

  const background =
    ctx.createRadialGradient(

      centerX,
      centerY,
      0,

      centerX,
      centerY,
      Math.max(W, H) * 0.9

    );


  background.addColorStop(
    0,
    "#39002d"
  );

  background.addColorStop(
    0.2,
    "#25001d"
  );

  background.addColorStop(
    0.45,
    "#11000f"
  );

  background.addColorStop(
    0.72,
    "#050006"
  );

  background.addColorStop(
    1,
    "#010002"
  );


  ctx.fillStyle =
    background;

  ctx.fillRect(
    0,
    0,
    W,
    H
  );


  /*
    Nebulosa viva.
  */

  const pulse =
    Math.sin(time * 0.22) * 0.5 + 0.5;


  const nebula =
    ctx.createRadialGradient(

      centerX,
      centerY,
      0,

      centerX,
      centerY,
      Math.min(W, H) * 0.78

    );


  nebula.addColorStop(
    0,
    `rgba(
      255,
      55,
      185,
      ${0.07 + pulse * 0.025}
    )`
  );

  nebula.addColorStop(
    0.28,
    `rgba(
      190,
      25,
      145,
      ${0.045 + pulse * 0.02}
    )`
  );

  nebula.addColorStop(
    0.65,
    "rgba(90,10,80,0.025)"
  );

  nebula.addColorStop(
    1,
    "rgba(255,0,150,0)"
  );


  ctx.fillStyle =
    nebula;

  ctx.fillRect(
    0,
    0,
    W,
    H
  );

}


/* =====================================================
   ESTRELLAS
===================================================== */

function drawStars(time) {

  for (const star of stars) {

    star.phase +=
      star.twinkle;


    const brightness =
      0.45 +
      Math.sin(star.phase) * 0.35;


    /*
      Parallax.
    */

    const x =
      star.x +
      smoothX *
      25 *
      star.depth;


    const y =
      star.y +
      smoothY *
      15 *
      star.depth;


    ctx.beginPath();


    ctx.fillStyle =
      `rgba(
        255,
        220,
        244,
        ${Math.max(
          0.05,
          star.alpha * brightness
        )}
      )`;


    ctx.arc(

      x,
      y,

      star.size *
      (0.65 + star.depth),

      0,
      Math.PI * 2

    );


    ctx.fill();


    /*
      Algunas estrellas tienen
      un pequeño destello.
    */

    if (
      star.depth > 0.38 &&
      brightness > 0.7
    ) {

      ctx.strokeStyle =
        `rgba(
          255,
          190,
          230,
          ${brightness * 0.35}
        )`;

      ctx.lineWidth = 0.5;


      ctx.beginPath();

      ctx.moveTo(
        x - 4 * star.depth,
        y
      );

      ctx.lineTo(
        x + 4 * star.depth,
        y
      );

      ctx.moveTo(
        x,
        y - 4 * star.depth
      );

      ctx.lineTo(
        x,
        y + 4 * star.depth
      );

      ctx.stroke();

    }

  }

}


/* =====================================================
   GALAXIA ESPIRAL
===================================================== */

function drawGalaxy(time) {

  if (!started) {
    return;
  }


  const elapsed =
    time - startTime;


  /*
    La galaxia aparece
    progresivamente.
  */

  const formation =
    Math.min(
      1,
      elapsed / 5.5
    );


  const expansion =
    0.035 +
    0.965 *
    (
      1 -
      Math.pow(
        1 - formation,
        2.2
      )
    );


  /*
    Movimiento lento de rotación.
  */

  const rotation =
    time * 0.035;


  const centerX =
    W * 0.5 +
    smoothX * 14;


  const centerY =
    H * 0.48 +
    smoothY * 8;


  /*
    Perspectiva de galaxia.
  */

  const flatten =
    0.28 +
    formation * 0.08;


  for (const p of galaxy) {

    /*
      Movimiento orbital.
    */

    p.angle +=
      p.speed *
      (
        1 +
        formation * 3
      );


    const radius =
      p.radius *
      expansion;


    /*
      Espiral.
    */

    const spiral =
      p.angle +
      radius * 0.0018 +
      rotation +
      p.armOffset;


    /*
      Pequeña distorsión
      natural en los brazos.
    */

    const wave =
      Math.sin(
        p.angle * 3 +
        radius * 0.006
      ) *
      radius *
      0.025;


    const finalRadius =
      radius + wave;


    const x =
      centerX +
      Math.cos(spiral) *
      finalRadius;


    const y =
      centerY +
      Math.sin(spiral) *
      finalRadius *
      flatten;


    /*
      Profundidad.
    */

    const depth =
      p.depth;


    const size =
      p.size *
      (
        0.45 +
        depth * 1.65
      );


    const alpha =
      p.alpha *
      (
        0.04 +
        formation * 0.96
      );


    /*
      Colores:
      lejos = violeta
      cerca = rosa
      centro = blanco/rosa.
    */

    const red = 255;

    const green =
      105 +
      depth * 115;

    const blue =
      175 +
      depth * 70;


    ctx.beginPath();


    ctx.fillStyle =
      `rgba(
        ${red},
        ${green},
        ${blue},
        ${alpha}
      )`;


    /*
      Glow solo en partículas
      importantes para no sobrecargar
      el iPhone.
    */

    if (depth > 0.76) {

      ctx.shadowBlur =
        3 + depth * 6;

      ctx.shadowColor =
        "#ff55b7";

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
    NÚCLEO CENTRAL
  */

  const core =
    ctx.createRadialGradient(

      centerX,
      centerY,
      0,

      centerX,
      centerY,
      Math.min(W, H) * 0.3

    );


  core.addColorStop(
    0,
    `rgba(
      255,
      235,
      250,
      ${0.24 * formation}
    )`
  );

  core.addColorStop(
    0.08,
    `rgba(
      255,
      150,
      220,
      ${0.18 * formation}
    )`
  );

  core.addColorStop(
    0.3,
    `rgba(
      255,
      60,
      185,
      ${0.06 * formation}
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

}


/* =====================================================
   PRIMER PLANO
===================================================== */

function drawForeground(time) {

  if (!started) {
    return;
  }


  for (const p of foreground) {

    p.phase += 0.004;


    const x =
      p.x +

      smoothX *
      45 *
      p.depth +

      Math.sin(
        time * 0.18 +
        p.phase
      ) * 6;


    const y =
      p.y +

      smoothY *
      25 *
      p.depth +

      Math.cos(
        time * 0.15 +
        p.phase
      ) * 5;


    ctx.beginPath();


    ctx.fillStyle =
      `rgba(
        255,
        170,
        225,
        ${0.06 + p.depth * 0.32}
      )`;


    ctx.shadowBlur =
      2 +
      p.depth * 6;

    ctx.shadowColor =
      "#ff63bb";


    ctx.arc(

      x,
      y,

      p.size *
      (
        0.4 +
        p.depth
      ),

      0,
      Math.PI * 2

    );


    ctx.fill();

  }


  ctx.shadowBlur = 0;

}


/* =====================================================
   ESTRELLAS FUGACES
===================================================== */

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


    if (s.delay > 0) {

      s.delay -=
        0.016;

      continue;

    }


    s.x +=
      s.speed;


    s.y +=
      s.speed * 0.32;


    s.alpha -=
      0.009;


    const gradient =
      ctx.createLinearGradient(

        s.x,
        s.y,

        s.x -
          s.length,

        s.y -
          s.length * 0.32

      );


    gradient.addColorStop(

      0,

      `rgba(
        255,
        255,
        255,
        ${s.alpha}
      )`

    );


    gradient.addColorStop(

      0.2,

      `rgba(
        255,
        180,
        230,
        ${s.alpha * 0.9}
      )`

    );


    gradient.addColorStop(

      0.55,

      `rgba(
        255,
        70,
        190,
        ${s.alpha * 0.45}
      )`

    );


    gradient.addColorStop(
      1,
      "rgba(255,0,150,0)"
    );


    ctx.beginPath();


    ctx.strokeStyle =
      gradient;

    ctx.lineWidth =
      1.4;


    ctx.moveTo(
      s.x,
      s.y
    );


    ctx.lineTo(

      s.x -
        s.length,

      s.y -
        s.length * 0.32

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
        ${s.alpha}
      )`;

    ctx.shadowBlur =
      12;

    ctx.shadowColor =
      "#ff7ac5";


    ctx.arc(
      s.x,
      s.y,
      1.8,
      0,
      Math.PI * 2
    );


    ctx.fill();


    ctx.shadowBlur = 0;


    if (
      s.alpha <= 0 ||
      s.x > W + 200 ||
      s.y > H + 150
    ) {

      shootingStars[i] =
        createShootingStar(false);

    }

  }

}


/* =====================================================
   ANIMACIÓN PRINCIPAL
===================================================== */

function animate(timestamp) {

  const time =
    timestamp * 0.001;


  /*
    Movimiento suave de la cámara.
  */

  smoothX +=
    (
      targetX -
      smoothX
    ) * 0.035;


  smoothY +=
    (
      targetY -
      smoothY
    ) * 0.035;


  drawBackground(time);

  drawStars(time);

  drawGalaxy(time);

  drawForeground(time);

  drawShootingStars();


  requestAnimationFrame(
    animate
  );

}


/* =====================================================
   ENTRADA AL UNIVERSO
===================================================== */

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
          "El navegador requiere otra interacción para reproducir audio."
        );

      }

    }


    /*
      Desaparece la portada.
    */

    const intro =
      document.getElementById("intro");


    if (intro) {

      intro.classList.add(
        "hide"
      );

    }


    /*
      Título superior.
    */

    const topTitle =
      document.getElementById("topTitle");


    if (topTitle) {

      topTitle.classList.add(
        "show"
      );

    }

  }
);


/* =====================================================
   PARALLAX — MOUSE
===================================================== */

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


/* =====================================================
   PARALLAX — TOUCH
===================================================== */

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


/* =====================================================
   INICIO
===================================================== */

resize();

requestAnimationFrame(
  animate
);
