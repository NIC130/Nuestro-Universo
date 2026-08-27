"use strict";


/* =====================================================
   ELEMENTOS
===================================================== */

const canvas =
  document.getElementById("universe");

const ctx =
  canvas.getContext("2d");


const welcome =
  document.getElementById("welcome");

const enterButton =
  document.getElementById("enterButton");

const message =
  document.getElementById("message");

const music =
  document.getElementById("music");

const musicButton =
  document.getElementById("musicButton");


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

let width = 0;

let height = 0;

let dpr = 1;

let stars = [];

let particles = [];

let foreground = [];

let shootingStars = [];

let started = false;

let universeStart = 0;

let phraseIndex = 0;

let pointerX = 0;

let pointerY = 0;

let targetX = 0;

let targetY = 0;

let phraseTimer = null;


/* =====================================================
   RANDOM
===================================================== */

function random(min, max) {

  return (
    Math.random() *
    (max - min)
    + min
  );

}


/* =====================================================
   RESIZE
===================================================== */

function resize() {

  width =
    window.innerWidth;

  height =
    window.innerHeight;


  dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );


  canvas.width =
    width * dpr;

  canvas.height =
    height * dpr;


  canvas.style.width =
    width + "px";

  canvas.style.height =
    height + "px";


  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );


  createScene();

}


window.addEventListener(
  "resize",
  resize
);


/* =====================================================
   CREAR ESCENA
===================================================== */

function createScene() {

  stars = [];

  particles = [];

  foreground = [];

  shootingStars = [];


  /* ---------------------------------------------
     ESTRELLAS DE FONDO
  --------------------------------------------- */

  const starCount =
    width < 600
      ? 320
      : 480;


  for (
    let i = 0;
    i < starCount;
    i++
  ) {

    stars.push({

      x:
        Math.random() * width,

      y:
        Math.random() * height,

      radius:
        random(.2, 1.45),

      depth:
        random(.15, 1),

      phase:
        random(
          0,
          Math.PI * 2
        ),

      twinkle:
        random(.008, .03)

    });

  }


  /* ---------------------------------------------
     GALAXIA
  --------------------------------------------- */

  const particleCount =
    width < 600
      ? 900
      : 1400;


  for (
    let i = 0;
    i < particleCount;
    i++
  ) {

    const angle =
      Math.random() *
      Math.PI *
      2;


    const radius =
      Math.pow(
        Math.random(),
        .55
      ) *
      Math.max(
        width,
        height
      ) *
      .62;


    particles.push({

      angle:
        angle,

      radius:
        radius,

      depth:
        random(.05, 1),

      size:
        random(.35, 1.8),

      alpha:
        random(.18, .85),

      speed:
        random(.00025, .00115),

      phase:
        random(
          0,
          Math.PI * 2
        )

    });

  }


  /* ---------------------------------------------
     PARTÍCULAS EN PRIMER PLANO
  --------------------------------------------- */

  for (
    let i = 0;
    i < 450;
    i++
  ) {

    foreground.push({

      x:
        Math.random() * width,

      y:
        Math.random() * height,

      size:
        random(.3, 2),

      depth:
        random(.5, 1),

      phase:
        random(
          0,
          Math.PI * 2
        )

    });

  }


  /* ---------------------------------------------
     ESTRELLAS FUGACES
  --------------------------------------------- */

  for (
    let i = 0;
    i < 4;
    i++
  ) {

    shootingStars.push(
      createShootingStar(true)
    );

  }

}


/* =====================================================
   ESTRELLA FUGAZ
===================================================== */

function createShootingStar(
  initial
) {

  return {

    x:
      initial
        ? random(0, width)
        : width + 100,

    y:
      initial
        ? random(0, height * .55)
        : random(-50, height * .35),

    speed:
      random(6, 11),

    length:
      random(55, 130),

    alpha:
      1,

    delay:
      initial
        ? random(0, 4)
        : 0

  };

}


/* =====================================================
   FONDO
===================================================== */

function drawBackground(time) {

  const gradient =
    ctx.createRadialGradient(

      width * .5,
      height * .48,
      0,

      width * .5,
      height * .48,

      Math.max(
        width,
        height
      ) * .82

    );


  gradient.addColorStop(
    0,
    "#350027"
  );


  gradient.addColorStop(
    .25,
    "#210019"
  );


  gradient.addColorStop(
    .55,
    "#0e000d"
  );


  gradient.addColorStop(
    1,
    "#020003"
  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(
    0,
    0,
    width,
    height
  );


  if (!started) {
    return;
  }


  const elapsed =
    time -
    universeStart;


  const progress =
    Math.min(
      1,
      elapsed / 5
    );


  /* ---------------------------------------------
     LUZ CENTRAL
  --------------------------------------------- */

  const glow =
    ctx.createRadialGradient(

      width * .5,
      height * .48,
      0,

      width * .5,
      height * .48,

      Math.min(
        width,
        height
      ) * .65

    );


  glow.addColorStop(

    0,

    `rgba(
      255,
      55,
      180,
      ${.08 + progress * .12}
    )`

  );


  glow.addColorStop(

    .4,

    `rgba(
      190,
      20,
      120,
      ${.035 + progress * .05}
    )`

  );


  glow.addColorStop(
    1,
    "rgba(255,0,150,0)"
  );


  ctx.fillStyle =
    glow;


  ctx.fillRect(
    0,
    0,
    width,
    height
  );

}


/* =====================================================
   ESTRELLAS
===================================================== */

function drawStars() {

  for (
    const star of stars
  ) {

    star.phase +=
      star.twinkle;


    const brightness =
      .35 +
      .65 *
      (
        .5 +
        .5 *
        Math.sin(
          star.phase
        )
      );


    const x =
      star.x +
      pointerX *
      20 *
      star.depth;


    const y =
      star.y +
      pointerY *
      12 *
      star.depth;


    ctx.beginPath();


    ctx.fillStyle =
      `rgba(
        255,
        215,
        240,
        ${brightness * star.depth}
      )`;


    ctx.shadowBlur =
      star.depth > .8
        ? 8
        : 2;


    ctx.shadowColor =
      "#ff6fbd";


    ctx.arc(

      x,
      y,

      star.radius *
      (
        .5 +
        star.depth
      ),

      0,
      Math.PI * 2

    );


    ctx.fill();


    /* DESTELLO */

    if (
      star.depth > .9 &&
      brightness > .92
    ) {

      ctx.strokeStyle =
        "rgba(255,190,230,.5)";


      ctx.lineWidth =
        .5;


      ctx.beginPath();


      ctx.moveTo(
        x - 5,
        y
      );

      ctx.lineTo(
        x + 5,
        y
      );


      ctx.moveTo(
        x,
        y - 5
      );

      ctx.lineTo(
        x,
        y + 5
      );


      ctx.stroke();

    }

  }


  ctx.shadowBlur =
    0;

}


/* =====================================================
   GALAXIA
===================================================== */

function drawGalaxy(time) {

  let progress = 0;


  if (started) {

    progress =
      Math.min(
        1,
        (
          time -
          universeStart
        ) / 5
      );

  }


  /*
    La galaxia comienza pequeña
    y lentamente se expande.
  */

  const expansion =
    .045 +
    .955 *
    (
      1 -
      Math.pow(
        1 - progress,
        2
      )
    );


  const centerX =
    width * .5 +
    pointerX * 8;


  const centerY =
    height * .48 +
    pointerY * 5;


  for (
    const p of particles
  ) {

    p.angle +=
      p.speed *
      (
        1 +
        progress * 5
      );


    const radius =
      p.radius *
      expansion;


    /*
      Espiral.
    */

    const spiral =
      p.angle +
      radius *
      .0018;


    /*
      Forma aplanada
      de galaxia.
    */

    const flatten =
      .32 +
      p.depth * .22;


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
      flatten;


    /*
      Profundidad.
    */

    const size =
      p.size *
      (
        .45 +
        p.depth * 1.4
      );


    const alpha =
      p.alpha *
      (
        .08 +
        progress * .95
      );


    ctx.beginPath();


    ctx.fillStyle =
      `rgba(
        255,
        ${125 + p.depth * 85},
        ${185 + p.depth * 65},
        ${alpha}
      )`;


    ctx.shadowBlur =
      2 +
      p.depth * 8;


    ctx.shadowColor =
      "#ff4fac";


    ctx.arc(
      x,
      y,
      size,
      0,
      Math.PI * 2
    );


    ctx.fill();

  }


  ctx.shadowBlur =
    0;

}


/* =====================================================
   PRIMER PLANO
===================================================== */

function drawForeground(time) {

  if (!started) {
    return;
  }


  for (
    const p of foreground
  ) {

    p.phase +=
      .006;


    const x =
      p.x +

      Math.sin(
        time * .2 +
        p.phase
      ) * 8 +

      pointerX *
      35 *
      p.depth;


    const y =
      p.y +

      Math.cos(
        time * .15 +
        p.phase
      ) * 5 +

      pointerY *
      20 *
      p.depth;


    ctx.beginPath();


    ctx.fillStyle =
      `rgba(
        255,
        155,
        220,
        ${.1 + p.depth * .38}
      )`;


    ctx.shadowBlur =
      4 +
      p.depth * 6;


    ctx.shadowColor =
      "#ff5bb5";


    ctx.arc(

      x,
      y,

      p.size *
      (
        .4 +
        p.depth
      ),

      0,
      Math.PI * 2

    );


    ctx.fill();

  }


  ctx.shadowBlur =
    0;

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

    const star =
      shootingStars[i];


    if (star.delay > 0) {

      star.delay -=
        .016;

      continue;

    }


    star.x +=
      star.speed;


    star.y +=
      star.speed * .35;


    star.alpha -=
      .012;


    const gradient =
      ctx.createLinearGradient(

        star.x,
        star.y,

        star.x -
          star.length,

        star.y -
          star.length * .35

      );


    gradient.addColorStop(
      0,
      `rgba(
        255,
        250,
        255,
        ${star.alpha}
      )`
    );


    gradient.addColorStop(
      .3,
      `rgba(
        255,
        145,
        215,
        ${star.alpha * .7}
      )`
    );


    gradient.addColorStop(
      1,
      "rgba(255,40,170,0)"
    );


    ctx.strokeStyle =
      gradient;


    ctx.lineWidth =
      1.2;


    ctx.beginPath();


    ctx.moveTo(
      star.x,
      star.y
    );


    ctx.lineTo(

      star.x -
        star.length,

      star.y -
        star.length * .35

    );


    ctx.stroke();


    if (
      star.alpha <= 0 ||
      star.x > width + 150 ||
      star.y > height + 100
    ) {

      shootingStars[i] =
        createShootingStar(false);

    }

  }

}


/* =====================================================
   ANIMACIÓN
===================================================== */

function animate(timestamp) {

  const time =
    timestamp * .001;


  pointerX +=
    (
      targetX -
      pointerX
    ) * .035;


  pointerY +=
    (
      targetY -
      pointerY
    ) * .035;


  drawBackground(
    time
  );


  drawStars();


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


/* =====================================================
   FRASES
===================================================== */

function hideMessage() {

  message.classList.remove(
    "visible"
  );

}


function showMessage(
  text
) {

  hideMessage();


  setTimeout(
    () => {

      message.innerHTML =
        text;


      message.classList.add(
        "visible"
      );

    },
    850
  );

}


function startMessages() {

  phraseIndex = 0;


  showMessage(
    phrases[phraseIndex]
  );


  phraseTimer =
    setInterval(
      () => {

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


        showMessage(
          phrases[phraseIndex]
        );

      },
      5850
    );

}


/* =====================================================
   FINAL
===================================================== */

function showFinal() {

  setTimeout(
    () => {

      message.classList.remove(
        "visible"
      );


      setTimeout(
        () => {

          message.classList.add(
            "final"
          );


          message.innerHTML =

            `Contigo, todo tiene más sentido.
            <br>
            Gracias por formar parte de mi universo.
            <span class="love">
              Te amo muchote. ♡
            </span>`;


          message.classList.add(
            "visible"
          );

        },
        850
      );

    },
    300
  );

}


/* =====================================================
   MÚSICA
===================================================== */

async function startMusic() {

  try {

    music.volume =
      .55;


    await music.play();


    musicButton.textContent =
      "♫";

  }

  catch (error) {

    /*
      Safari puede necesitar
      otra interacción.
      El botón de música queda
      disponible.
    */

    musicButton.textContent =
      "♫";

  }

}


/* =====================================================
   ENTRAR
===================================================== */

function enterUniverse(
  event
) {

  event.preventDefault();


  if (started) {
    return;
  }


  started = true;


  universeStart =
    performance.now() *
    .001;


  /*
    La música se inicia
    directamente desde el toque.
  */

  startMusic();


  /*
    La pantalla inicial
    desaparece.
  */

  welcome.classList.add(
    "open"
  );


  /*
    Dejamos que el universo
    se forme antes de mostrar
    la primera frase.
  */

  setTimeout(
    () => {

      startMessages();

    },
    6500
  );

}


enterButton.addEventListener(
  "click",
  enterUniverse
);


/* =====================================================
   MÚSICA MANUAL
===================================================== */

musicButton.addEventListener(
  "click",
  async () => {

    if (
      music.paused
    ) {

      try {

        await music.play();

        musicButton.textContent =
          "♫";

      }

      catch (error) {}

    }

    else {

      music.pause();

      musicButton.textContent =
        "Ⅱ";

    }

  }
);


/* =====================================================
   MOVIMIENTO DEL CELULAR
===================================================== */

function updatePointer(
  x,
  y
) {

  targetX =
    (
      x -
      width / 2
    ) /
    width *
    2;


  targetY =
    (
      y -
      height / 2
    ) /
    height *
    2;

}


window.addEventListener(
  "pointermove",
  event => {

    if (
      event.pointerType !==
      "touch"
    ) {

      updatePointer(
        event.clientX,
        event.clientY
      );

    }

  },
  {
    passive: true
  }
);


window.addEventListener(
  "touchmove",
  event => {

    if (
      event.touches.length
    ) {

      updatePointer(

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
   INICIAR
===================================================== */

resize();

requestAnimationFrame(
  animate
);
