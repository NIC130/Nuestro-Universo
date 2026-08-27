"use strict";


/* =====================================================
   ELEMENTOS
===================================================== */

const canvas =
  document.getElementById("space");

const ctx =
  canvas.getContext("2d");

const intro =
  document.getElementById("intro");

const enter =
  document.getElementById("enter");

const message =
  document.getElementById("message");

const music =
  document.getElementById("music");

const musicControl =
  document.getElementById("musicControl");

const topTitle =
  document.getElementById("topTitle");


/* =====================================================
   FRASES
===================================================== */

const phrases = [

  "Tu existencia, fue lo más bonito que le pudo pasar a la mía.",

  "No necesito un universo perfecto, si puedo compartir el mío contigo.",

  "Gracias por todos los momentos juntas.",

  "Estos 3 meses son solo el comienzo de todo lo que quiero vivir contigo.",

  "Te elegiría una y mil veces."

];


/* =====================================================
   VARIABLES
===================================================== */

let W = 0;
let H = 0;
let DPR = 1;

let stars = [];
let galaxy = [];
let dust = [];
let meteors = [];

let started = false;

let startTime = 0;

let phraseTimer = null;

let phraseIndex = 0;

let targetX = 0;
let targetY = 0;

let smoothX = 0;
let smoothY = 0;


/* =====================================================
   RANDOM
===================================================== */

function random(min, max) {
  return Math.random() * (max - min) + min;
}


/* =====================================================
   RESIZE
===================================================== */

function resize() {

  W = window.innerWidth;
  H = window.innerHeight;

  DPR = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  canvas.width =
    Math.floor(W * DPR);

  canvas.height =
    Math.floor(H * DPR);

  canvas.style.width =
    W + "px";

  canvas.style.height =
    H + "px";

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


/* =====================================================
   CREAR UNIVERSO
===================================================== */

function createUniverse() {

  stars = [];
  galaxy = [];
  dust = [];
  meteors = [];


  /* ---------------------------------------------
     ESTRELLAS MUY LEJANAS
  --------------------------------------------- */

  for (let i = 0; i < 420; i++) {

    stars.push({

      x: Math.random() * W,
      y: Math.random() * H,

      size: random(.15, 1),

      depth: random(.05, .35),

      alpha: random(.15, .6),

      phase: random(0, Math.PI * 2),

      speed: random(.004, .015)

    });

  }


  /* ---------------------------------------------
     GALAXIA
  --------------------------------------------- */

  const amount =
    W < 600 ? 1500 : 2300;


  for (let i = 0; i < amount; i++) {

    const angle =
      Math.random() *
      Math.PI *
      2;


    /*
      Distribución que concentra
      más partículas hacia el centro.
    */

    const radius =
      Math.pow(
        Math.random(),
        .57
      ) *
      Math.max(W, H) *
      .64;


    galaxy.push({

      angle,

      radius,

      depth:
        random(.05, 1),

      size:
        random(.25, 1.6),

      alpha:
        random(.15, .9),

      speed:
        random(.0002, .0012),

      offset:
        random(-1, 1)

    });

  }


  /* ---------------------------------------------
     POLVO CÓSMICO EN PRIMER PLANO
  --------------------------------------------- */

  for (let i = 0; i < 600; i++) {

    dust.push({

      x: Math.random() * W,

      y: Math.random() * H,

      depth: random(.45, 1),

      size: random(.3, 2.1),

      phase:
        random(0, Math.PI * 2)

    });

  }


  /* ---------------------------------------------
     METEOROS
  --------------------------------------------- */

  for (let i = 0; i < 3; i++) {

    meteors.push(
      newMeteor(true)
    );

  }

}


/* =====================================================
   METEORO
===================================================== */

function newMeteor(initial = false) {

  return {

    x:
      initial
        ? random(0, W)
        : W + 100,

    y:
      initial
        ? random(0, H * .5)
        : random(-100, H * .4),

    speed:
      random(7, 12),

    length:
      random(60, 130),

    alpha:
      initial
        ? random(.2, .8)
        : 1

  };

}


/* =====================================================
   FONDO
===================================================== */

function background(time) {

  const centerX =
    W * .5 +
    smoothX * 8;

  const centerY =
    H * .47 +
    smoothY * 5;


  const gradient =
    ctx.createRadialGradient(

      centerX,
      centerY,
      0,

      centerX,
      centerY,
      Math.max(W, H) * .85

    );


  gradient.addColorStop(
    0,
    "#3b002d"
  );

  gradient.addColorStop(
    .18,
    "#24001b"
  );

  gradient.addColorStop(
    .45,
    "#10000e"
  );

  gradient.addColorStop(
    .75,
    "#050006"
  );

  gradient.addColorStop(
    1,
    "#010002"
  );


  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    0,
    W,
    H
  );


  /*
    Nebulosa grande.
  */

  if (started) {

    const elapsed =
      time - startTime;

    const progress =
      Math.min(
        1,
        elapsed / 6
      );


    const nebula =
      ctx.createRadialGradient(

        centerX,
        centerY,
        0,

        centerX,
        centerY,
        Math.min(W, H) * .75

      );


    nebula.addColorStop(
      0,
      `rgba(
        255,
        45,
        180,
        ${.08 + progress * .08}
      )`
    );

    nebula.addColorStop(
      .32,
      `rgba(
        180,
        30,
        145,
        ${.045 + progress * .04}
      )`
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

}


/* =====================================================
   ESTRELLAS
===================================================== */

function drawStars(time) {

  for (const star of stars) {

    star.phase +=
      star.speed;


    const pulse =
      .5 +
      .5 *
      Math.sin(
        star.phase
      );


    /*
      Diferentes planos =
      diferentes desplazamientos.
    */

    const x =
      star.x +
      smoothX *
      18 *
      star.depth;


    const y =
      star.y +
      smoothY *
      10 *
      star.depth;


    ctx.beginPath();


    ctx.fillStyle =
      `rgba(
        255,
        215,
        240,
        ${star.alpha * (.65 + pulse * .35)}
      )`;


    ctx.arc(

      x,
      y,

      star.size *
      (.6 + star.depth),

      0,
      Math.PI * 2

    );


    ctx.fill();

  }

}


/* =====================================================
   GALAXIA
===================================================== */

function drawGalaxy(time) {

  if (!started) {
    return;
  }


  const elapsed =
    time - startTime;


  /*
    Entrada de la galaxia.
  */

  const progress =
    Math.min(
      1,
      elapsed / 6
    );


  const expansion =
    .025 +
    .975 *
    (
      1 -
      Math.pow(
        1 - progress,
        2.3
      )
    );


  const centerX =
    W * .5 +
    smoothX * 12;


  const centerY =
    H * .47 +
    smoothY * 7;


  /*
    Perspectiva.
  */

  const perspective =
    .28 +
    progress * .12;


  for (const p of galaxy) {

    /*
      Movimiento orbital.
    */

    p.angle +=
      p.speed *
      (
        1 +
        progress * 4
      );


    const radius =
      p.radius *
      expansion;


    /*
      Curvatura de los brazos.
    */

    const spiral =
      p.angle +
      radius *
      .00175;


    /*
      Perspectiva.
    */

    const x =
      centerX +
      Math.cos(
        spiral
      ) *
      radius;


    const y =
      centerY +
      Math.sin(
        spiral
      ) *
      radius *
      perspective;


    /*
      Profundidad.
    */

    const depth =
      p.depth;


    const size =
      p.size *
      (
        .45 +
        depth * 1.7
      );


    const alpha =
      p.alpha *
      (
        .05 +
        progress * .95
      );


    /*
      Color según profundidad.
    */

    ctx.beginPath();


    ctx.fillStyle =
      `rgba(
        255,
        ${125 + depth * 90},
        ${180 + depth * 70},
        ${alpha}
      )`;


    /*
      Las partículas cercanas
      tienen más glow.
    */

    if (depth > .75) {

      ctx.shadowBlur =
        5 + depth * 7;

      ctx.shadowColor =
        "#ff52b4";

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
    Núcleo brillante.
  */

  const core =
    ctx.createRadialGradient(

      centerX,
      centerY,
      0,

      centerX,
      centerY,
      Math.min(W, H) * .28

    );


  core.addColorStop(
    0,
    `rgba(255,220,247,${.28 * progress})`
  );

  core.addColorStop(
    .12,
    `rgba(255,115,205,${.18 * progress})`
  );

  core.addColorStop(
    .45,
    "rgba(255,50,180,.045)"
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
   POLVO EN PRIMER PLANO
===================================================== */

function drawDust(time) {

  if (!started) {
    return;
  }


  for (const p of dust) {

    p.phase += .005;


    const x =
      p.x +

      smoothX *
      38 *
      p.depth +

      Math.sin(
        time * .18 +
        p.phase
      ) * 7;


    const y =
      p.y +

      smoothY *
      22 *
      p.depth +

      Math.cos(
        time * .14 +
        p.phase
      ) * 5;


    ctx.beginPath();


    ctx.fillStyle =
      `rgba(
        255,
        160,
        225,
        ${.08 + p.depth * .4}
      )`;


    ctx.shadowBlur =
      4 +
      p.depth * 7;


    ctx.shadowColor =
      "#ff62b8";


    ctx.arc(

      x,
      y,

      p.size *
      (.4 + p.depth),

      0,
      Math.PI * 2

    );


    ctx.fill();

  }


  ctx.shadowBlur = 0;

}


/* =====================================================
   METEOROS
===================================================== */

function drawMeteors() {

  if (!started) {
    return;
  }


  for (
    let i = 0;
    i < meteors.length;
    i++
  ) {

    const meteor =
      meteors[i];


    meteor.x +=
      meteor.speed;


    meteor.y +=
      meteor.speed * .35;


    meteor.alpha -=
      .008;


    const gradient =
      ctx.createLinearGradient(

        meteor.x,
        meteor.y,

        meteor.x -
          meteor.length,

        meteor.y -
          meteor.length * .35

      );


    gradient.addColorStop(
      0,
      `rgba(
        255,
        255,
        255,
        ${meteor.alpha}
      )`
    );


    gradient.addColorStop(
      .25,
      `rgba(
        255,
        140,
        215,
        ${meteor.alpha * .7}
      )`
    );


    gradient.addColorStop(
      1,
      "rgba(255,30,170,0)"
    );


    ctx.strokeStyle =
      gradient;

    ctx.lineWidth =
      1.4;


    ctx.beginPath();


    ctx.moveTo(
      meteor.x,
      meteor.y
    );


    ctx.lineTo(

      meteor.x -
        meteor.length,

      meteor.y -
        meteor.length * .35

    );


    ctx.stroke();


    if (
      meteor.alpha <= 0 ||
      meteor.x > W + 150 ||
      meteor.y > H + 100
    ) {

      meteors[i] =
        newMeteor(false);

    }

  }

}


/* =====================================================
   ANIMACIÓN
===================================================== */

function animate(timestamp) {

  const time =
    timestamp * .001;


  smoothX +=
    (
      targetX -
      smoothX
    ) * .035;


  smoothY +=
    (
      targetY -
      smoothY
    ) * .035;


  background(time);

  drawStars(time);

  drawGalaxy(time);

  drawDust(time);

  drawMeteors();


  requestAnimationFrame(
    animate
  );

}


/* =====================================================
   FRASES
===================================================== */

function showPhrase(text) {

  message.classList.remove(
    "show"
  );


  setTimeout(() => {

    message.innerHTML =
      text;


    message.classList.add(
      "show"
    );

  }, 900);

}


function startPhrases() {

  phraseIndex = 0;


  showPhrase(
    phrases[phraseIndex]
  );


  phraseTimer =
    setInterval(() => {

      phraseIndex++;


      if (
        phraseIndex >=
        phrases.length
      ) {

        clearInterval(
          phraseTimer
        );


        showFinal();

        return;

      }


      showPhrase(
        phrases[phraseIndex]
      );

    }, 5900);

}


/* =====================================================
   FINAL
===================================================== */

function showFinal() {

  setTimeout(() => {

    message.classList.remove(
      "show"
    );


    setTimeout(() => {

      message.classList.add(
        "final"
      );


      message.innerHTML = `

        Contigo, todo tiene más sentido.
        <br>
        Gracias por formar parte de mi universo.

        <span class="love">
          Te amo muchote. ♡
        </span>

      `;


      message.classList.add(
        "show"
      );

    }, 900);

  }, 300);

}


/* =====================================================
   MÚSICA
===================================================== */

async function startMusic() {

  try {

    music.volume =
      .55;

    await music.play();

    musicControl.textContent =
      "♫";

  } catch (error) {

    musicControl.textContent =
      "♫";

  }

}


/* =====================================================
   ENTRAR
===================================================== */

enter.addEventListener(
  "click",
  () => {

    if (started) {
      return;
    }


    started = true;


    startTime =
      performance.now() *
      .001;


    /*
      La música se solicita
      directamente desde el toque.
    */

    startMusic();


    /*
      Entrada cinematográfica.
    */

    intro.classList.add(
      "hide"
    );


    topTitle.classList.add(
      "show"
    );


    /*
      Dejamos que la galaxia
      aparezca antes de las frases.
    */

    setTimeout(() => {

      startPhrases();

    }, 7000);

  }
);


/* =====================================================
   CONTROL DE MÚSICA
===================================================== */

musicControl.addEventListener(
  "click",
  async () => {

    if (
      music.paused
    ) {

      try {

        await music.play();

        musicControl.textContent =
          "♫";

      } catch (error) {}

    } else {

      music.pause();

      musicControl.textContent =
        "Ⅱ";

    }

  }
);


/* =====================================================
   PARALLAX
===================================================== */

function moveScene(
  x,
  y
) {

  targetX =
    (
      x -
      W / 2
    ) /
    W *
    2;


  targetY =
    (
      y -
      H / 2
    ) /
    H *
    2;

}


/* Computadora */

window.addEventListener(
  "pointermove",
  event => {

    if (
      event.pointerType !==
      "touch"
    ) {

      moveScene(
        event.clientX,
        event.clientY
      );

    }

  },
  {
    passive: true
  }
);


/* Celular */

window.addEventListener(
  "touchmove",
  event => {

    if (
      event.touches.length
    ) {

      moveScene(

        event.touches[0].clientX,

        event.touches[0].clientY

      );

    }

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
