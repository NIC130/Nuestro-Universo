document.addEventListener("DOMContentLoaded", () => {

  const universe = document.getElementById("universe");
  const intro = document.getElementById("intro");
  const phrase = document.getElementById("phrase");

  const phrases = [
    "Tu existencia, fue lo más bonito que le pudo pasar a la mía.",
    "No necesito un universo perfecto, si puedo compartir el mío contigo.",
    "Gracias por todos los momentos juntas.",
    "Estos 3 meses son solo el comienzo de todo lo que quiero vivir contigo.",
    "Te elegiría una y mil veces."
  ];

  let currentPhrase = 0;

  // Crear estrellas
  function createStars() {
    for (let i = 0; i < 180; i++) {
      const star = document.createElement("div");

      star.className = "star";

      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";

      const size = Math.random() * 3 + 1;
      star.style.width = size + "px";
      star.style.height = size + "px";

      star.style.animationDelay =
        Math.random() * 4 + "s";

      universe.appendChild(star);
    }
  }

  createStars();

  // Universo inicial
  setTimeout(() => {
    universe.classList.add("zoom");
  }, 100);

  // Después del universo empiezan las frases
  setTimeout(() => {
    showPhrase();
  }, 5000);

  function showPhrase() {

    if (currentPhrase >= phrases.length) {
      showFinalMessage();
      return;
    }

    phrase.classList.remove("visible");

    setTimeout(() => {

      phrase.textContent = phrases[currentPhrase];

      phrase.classList.add("visible");

      currentPhrase++;

      // Cada frase dura aproximadamente 5 segundos
      setTimeout(() => {
        phrase.classList.remove("visible");

        setTimeout(() => {
          showPhrase();
        }, 700);

      }, 5000);

    }, 700);
  }

  function showFinalMessage() {

    setTimeout(() => {

      phrase.textContent =
        "Contigo, todo tiene más sentido. Gracias por formar parte de mi universo.";

      phrase.classList.add("visible");

    }, 700);
  }

});
