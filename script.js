(() => {

  "use strict";


  /* =========================================
     ELEMENTOS
  ========================================= */

  const canvas =
    document.getElementById("universe");

  const ctx =
    canvas.getContext(
      "2d",
      {
        alpha: false
      }
    );


  const intro =
    document.getElementById("intro");

  const enter =
    document.getElementById("enter");

  const phrase =
    document.getElementById("phrase");

  const music =
    document.getElementById("music");

  const musicButton =
    document.getElementById("musicButton");


  /* =========================================
     FRASES
  ========================================= */

  const phrases = [

    "Tu existencia, fue lo más bonito que le pudo pasar a la mía.",

    "No necesito un universo perfecto, si puedo compartir el mío contigo.",

    "Gracias por todos los momentos juntas.",

    "Estos 3 meses son solo el comienzo de todo lo que quiero vivir contigo.",

    "Te elegiría una y mil veces."

  ];


  /* =========================================
     VARIABLES
  ========================================= */

  let W = 0;
  let H = 0;

  let DPR = 1;

  let stars = [];
  let galaxy = [];
  let foreground = [];
  let meteors = [];

  let started = false;

  let startTime = 0;

  let phraseIndex = 0;

  let phraseTimer = null;

  let audioPlaying = false;

  let pointerX = 0;
  let pointerY = 0;

  let targetX = 0;
  let targetY = 0;


  /* =========================================
     RANDOM
  ========================================= */

  function random(min, max) {

    return Math.random() *
      (max - min) +
      min;

  }


  /* =========================================
     CREAR UNIVERSO
  ========================================= */

  function createUniverse() {

    stars = [];
    galaxy = [];
    foreground = [];
    meteors = [];


    /* ESTRELLAS */

    for (
      let i = 0;
      i < 420;
      i++
    ) {

      stars.push({

        x:
          Math.random() * W,

        y:
          Math.random() * H,

        depth:
          random(.1, 1),

        radius:
          random(.2, 1.6),

        phase:
          random(
            0,
            Math.PI * 2
          ),

        speed:
          random(.006, .025)

      });

    }


    /* GALAXIA */

    for (
      let i = 0;
      i < 1500;
      i++
    ) {

      const angle =
        Math.random() *
        Math.PI *
        2;


      const radius =
        Math.pow(
          Math.random(),
          .58
        ) *
        Math.max(W, H) *
        .62;


      galaxy.push({

        angle:
          angle,

        radius:
          radius,

        depth:
          random(.1, 1),

        size:
          random(.3, 1.8),

        alpha:
          random(.15, .75),

        phase:
          random(
            0,
            Math.PI * 2
          ),

        speed:
          random(.0003, .0012)

      });

    }


    /* PARTÍCULAS DELANTE */

    for (
      let i = 0;
      i < 550;
      i++
    ) {

      foreground.push({

        x:
          Math.random() * W,

        y:
          Math.random() * H,

        depth:
          random(.5, 1),

        size:
          random(.4, 2),

        phase:
          random(
            0,
            Math.PI * 2
          )

      });

    }


    /* ESTRELLAS FUGACES */

    for (
      let i = 0;
      i < 5;
      i++
    ) {

      meteors.push(
        createMeteor(true)
      );

    }

  }


  /* =========================================
     METEOROS
  ========================================= */

  function createMeteor(
    initial = false
  ) {

    return {

      x:
        initial
          ? Math.random() * W
          : W + 100,

      y:
        initial
          ? Math.random() * H * .5
          : Math.random() * H * .4,

      vx:
        random(-12, -6),

      vy:
        random(2.5, 5),

      length:
        random(50, 120),

      wait:
        initial
          ? random(0, 4)
          : 0

    };

  }


  /* =========================================
     RESIZE
  ========================================= */

  function resize() {

    W =
      window.innerWidth;

    H =
      window.innerHeight;


    DPR =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );


    canvas.width =
      Math.floor(
        W * DPR
      );

    canvas.height =
      Math.floor(
        H * DPR
      );


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


  /* =========================================
     FONDO
  ========================================= */

  function drawBackground(time) {

    const gradient =
      ctx.createRadialGradient(

        W * .5,
        H * .48,
        0,

        W * .5,
        H * .48,

        Math.max(W, H) * .8

      );


    gradient.addColorStop(
      0,
      "#28001f"
    );

    gradient.addColorStop(
      .3,
      "#15000f"
    );

    gradient.addColorStop(
      .65,
      "#080009"
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
      W,
      H
    );


    /* LUZ CENTRAL */

    if (started) {

      const progress =
        Math.min(
          1,
          (time - startTime) / 4
        );


      const glow =
        ctx.createRadialGradient(

          W * .5,
          H * .48,
          0,

          W * .5,
          H * .48,
          Math.min(W, H) * .55

        );


      glow.addColorStop(

        0,

        `rgba(
          255,
          70,
          185,
          ${.05 + progress * .12}
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
        W,
        H
      );

    }

  }


  /* =========================================
     ESTRELLAS
  ========================================= */

  function drawStars() {

    for (
      const star of stars
    ) {

      star.phase +=
        star.speed;


      const twinkle =
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
        18 *
        star.depth;


      const y =
        star.y +
        pointerY *
        10 *
        star.depth;


      ctx.beginPath();


      ctx.fillStyle =
        `rgba(
          255,
          215,
          240,
          ${twinkle * star.depth}
        )`;


      ctx.shadowBlur =
        star.depth > .75
          ? 10
          : 2;


      ctx.shadowColor =
        "#ff72c0";


      ctx.arc(

        x,
        y,

        star.radius *
        (.5 + star.depth),

        0,
        Math.PI * 2

      );


      ctx.fill();


      /* DESTELLOS */

      if (
        star.depth > .9 &&
        twinkle > .92
      ) {

        ctx.strokeStyle =
          `rgba(
            255,
            190,
            230,
            .5
          )`;


        ctx.lineWidth =
          .6;


        ctx.beginPath();


        ctx.moveTo(
          x - 7,
          y
        );

        ctx.lineTo(
          x + 7,
          y
        );


        ctx.moveTo(
          x,
          y - 7
        );

        ctx.lineTo(
          x,
          y + 7
        );


        ctx.stroke();

      }

    }


    ctx.shadowBlur = 0;

  }


  /* =========================================
     GALAXIA
  ========================================= */

  function drawGalaxy(time) {

    let progress = 0;


    if (started) {

      progress =
        Math.min(
          1,
          (time - startTime) / 4
        );

    }


    /*
      La galaxia comienza pequeña
      y se expande.
    */

    const expansion =
      .08 +
      .92 *
      (
        1 -
        Math.pow(
          1 - progress,
          2
        )
      );


    const centerX =
      W * .5 +
      pointerX * 7;


    const centerY =
      H * .49 +
      pointerY * 4;


    for (
      const p of galaxy
    ) {

      p.angle +=
        p.speed *
        (
          1 +
          progress * 4
        );


      const radius =
        p.radius *
        expansion;


      const spiral =
        p.angle +
        radius *
        .0018;


      const flatten =
        .35 +
        p.depth * .2;


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


      const alpha =
        p.alpha *
        (
          .12 +
          progress * .95
        );


      const size =
        p.size *
        (
          .5 +
          p.depth
        );


      ctx.beginPath();


      ctx.fillStyle =
        `rgba(
          255,
          ${125 + p.depth * 75},
          ${190 + p.depth * 55},
          ${alpha}
        )`;


      ctx.shadowBlur =
        3 +
        p.depth * 8;


      ctx.shadowColor =
        "#ff55b5";


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

  }


  /* =========================================
     PARTÍCULAS DELANTE
  ========================================= */

  function drawForeground(time) {

    for (
      const p of foreground
    ) {

      p.phase +=
        .008;


      const x =
        p.x +

        Math.sin(
          time * .18 +
          p.phase
        ) *
        7 +

        pointerX *
        25 *
        p.depth;


      const y =
        p.y +

        Math.cos(
          time * .14 +
          p.phase
        ) *
        5 +

        pointerY *
        16 *
        p.depth;


      const alpha =
        .1 +
        .4 *
        p.depth;


      ctx.beginPath();


      ctx.fillStyle =
        `rgba(
          255,
          155,
          220,
          ${alpha}
        )`;


      ctx.shadowBlur =
        5 +
        p.depth * 5;


      ctx.shadowColor =
        "#ff5eb7";


      ctx.arc(

        x,
        y,

        p.size *
        (.5 + p.depth),

        0,
        Math.PI * 2

      );


      ctx.fill();

    }


    ctx.shadowBlur = 0;

  }


  /* =========================================
     METEOROS
  ========================================= */

  function drawMeteors() {

    for (
      let i = 0;
      i < meteors.length;
      i++
    ) {

      const meteor =
        meteors[i];


      if (
        meteor.wait > 0
      ) {

        meteor.wait -=
          .016;

        continue;

      }


      meteor.x +=
        meteor.vx;


      meteor.y +=
        meteor.vy;


      if (
        meteor.x < -180 ||
        meteor.y > H + 100
      ) {

        meteors[i] =
          createMeteor(
            false
          );

        continue;

      }


      const gradient =
        ctx.createLinearGradient(

          meteor.x,
          meteor.y,

          meteor.x +
            meteor.length,

          meteor.y -
            meteor.length * .5

        );


      gradient.addColorStop(
        0,
        "rgba(255,245,252,.95)"
      );


      gradient.addColorStop(
        .25,
        "rgba(255,145,215,.7)"
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
        meteor.x,
        meteor.y
      );


      ctx.lineTo(

        meteor.x +
          meteor.length,

        meteor.y -
          meteor.length * .5

      );


      ctx.stroke();

    }

  }


  /* =========================================
     ANIMACIÓN
  ========================================= */

  function animate(time) {

    const seconds =
      time * .001;


    pointerX +=
      (
        targetX -
        pointerX
      ) *
      .035;


    pointerY +=
      (
        targetY -
        pointerY
      ) *
      .035;


    drawBackground(
      seconds
    );


    drawStars();


    drawGalaxy(
      seconds
    );


    drawForeground(
      seconds
    );


    drawMeteors();


    requestAnimationFrame(
      animate
    );

  }


  /* =========================================
     MÚSICA
  ========================================= */

  function startMusic() {

    if (audioPlaying) {
      return;
    }


    audioPlaying = true;


    try {

      music.volume =
        .55;


      const playPromise =
        music.play();


      if (
        playPromise &&
        playPromise.catch
      ) {

        playPromise.catch(
          () => {}
        );

      }

    } catch (error) {}

  }


  /* =========================================
     FRASES
  ========================================= */

  function showPhrase(
    index
  ) {

    if (
      index >=
      phrases.length
    ) {

      showFinal();

      return;

    }


    phrase.classList.remove(
      "show"
    );


    setTimeout(
      () => {

        phrase.innerHTML =
          phrases[index];


        phrase.classList.add(
          "show"
        );


        phraseTimer =
          setTimeout(
            () => {

              phrase.classList.remove(
                "show"
              );


              setTimeout(
                () => {

                  showPhrase(
                    index + 1
                  );

                },
                900
              );


            },
            5000
          );


      },
      900
    );

  }


  /* =========================================
     MENSAJE FINAL
  ========================================= */

  function showFinal() {

    phrase.classList.remove(
      "show"
    );


    setTimeout(
      () => {

        phrase.innerHTML =

          `Contigo, todo tiene más sentido.
          <br>
          Gracias por formar parte de mi universo.
          <span>
            Te amo muchote. ♡
          </span>`;


        phrase.classList.add(
          "final"
        );


        phrase.classList.add(
          "show"
        );


      },
      900
    );

  }


  /* =========================================
     ENTRAR
  ========================================= */

  function enterUniverse(
    event
  ) {

    if (event) {

      event.preventDefault();

    }


    if (started) {
      return;
    }


    started = true;


    startTime =
      performance.now() *
      .001;


    /*
      IMPORTANTE:
      iPhone permite reproducir
      audio iniciado por interacción.
    */

    startMusic();


    intro.classList.add(
      "hide"
    );


    /*
      Dejamos que el universo
      se forme durante unos segundos.
    */

    setTimeout(
      () => {

        showPhrase(
          0
        );

      },
      5200
    );

  }


  /* =========================================
     BOTÓN ENTRAR
  ========================================= */

  enter.addEventListener(

    "touchend",

    enterUniverse,

    {
      passive: false
    }

  );


  enter.addEventListener(

    "click",

    enterUniverse

  );


  /* =========================================
     BOTÓN MÚSICA
  ========================================= */

  musicButton.addEventListener(

    "touchend",

    (event) => {

      event.preventDefault();


      if (
        music.paused
      ) {

        music
          .play()
          .catch(
            () => {}
          );


        musicButton.textContent =
          "♫";

      } else {

        music.pause();


        musicButton.textContent =
          "Ⅱ";

      }

    },

    {
      passive: false
    }

  );


  musicButton.addEventListener(

    "click",

    () => {

      if (
        music.paused
      ) {

        music
          .play()
          .catch(
            () => {}
          );


        musicButton.textContent =
          "♫";

      } else {

        music.pause();


        musicButton.textContent =
          "Ⅱ";

      }

    }

  );


  /* =========================================
     MOVIMIENTO
  ========================================= */

  function movePointer(
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


  window.addEventListener(

    "pointermove",

    (event) => {

      if (
        event.pointerType !==
        "touch"
      ) {

        movePointer(
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

    (event) => {

      if (
        event.touches.length
      ) {

        movePointer(

          event.touches[0].clientX,

          event.touches[0].clientY

        );

      }

    },

    {
      passive: true
    }

  );


  /* =========================================
     INICIAR
  ========================================= */

  window.addEventListener(
    "resize",
    resize
  );


  resize();


  requestAnimationFrame(
    animate
  );

})();
