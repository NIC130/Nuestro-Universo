(function(){

"use strict";

var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

var W=0,H=0,DPR=1;
var stars=[];
var particles=[];
var meteors=[];
var started=false;
var tiltX=0,tiltY=0;
var smoothX=0,smoothY=0;

function random(a,b){
  return Math.random()*(b-a)+a;
}

function resize(){
  W=window.innerWidth;
  H=window.innerHeight;
  DPR=Math.min(window.devicePixelRatio||1,2);

  canvas.width=Math.floor(W*DPR);
  canvas.height=Math.floor(H*DPR);
  canvas.style.width=W+"px";
  canvas.style.height=H+"px";

  ctx.setTransform(DPR,0,0,DPR,0,0);

  createStars();
  createParticles();
  createMeteors();
}

function createStars(){
  stars=[];
  for(var i=0;i<320;i++){
    stars.push({
      x:Math.random()*W,
      y:Math.random()*H,
      z:random(.15,1),
      r:random(.3,1.5),
      phase:random(0,Math.PI*2),
      speed:random(.006,.025)
    });
  }
}

function createParticles(){
  particles=[];
  for(var i=0;i<650;i++){
    particles.push({
      x:Math.random()*W,
      y:Math.random()*H,
      z:random(.15,1),
      r:random(.3,1.6),
      phase:random(0,Math.PI*2)
    });
  }
}

function meteor(){
  return {
    x:W+random(0,250),
    y:random(-50,H*.45),
    vx:random(-8,-13),
    vy:random(3,6),
    length:random(45,110)
  };
}

function createMeteors(){
  meteors=[];
  for(var i=0;i<4;i++){
    var m=meteor();
    m.x=random(0,W);
    m.y=random(0,H*.5);
    meteors.push(m);
  }
}

function drawBackground(t){

  var g=ctx.createRadialGradient(
    W*.5,H*.45,0,
    W*.5,H*.45,Math.max(W,H)*.8
  );

  g.addColorStop(0,"#30001f");
  g.addColorStop(.38,"#16000f");
  g.addColorStop(1,"#030005");

  ctx.fillStyle=g;
  ctx.fillRect(0,0,W,H);

  for(var i=0;i<3;i++){

    var x=W*(.2+i*.3)+Math.sin(t*.1+i)*35;
    var y=H*(.25+i*.18);

    var n=ctx.createRadialGradient(
      x,y,0,x,y,W*.38
    );

    n.addColorStop(0,"rgba(255,60,175,.10)");
    n.addColorStop(1,"rgba(255,60,175,0)");

    ctx.fillStyle=n;
    ctx.fillRect(0,0,W,H);
  }
}

function drawStars(t){

  for(var i=0;i<stars.length;i++){

    var s=stars[i];

    s.phase+=s.speed;

    var alpha=.45+.45*Math.sin(s.phase);

    var x=s.x+smoothX*18*s.z;
    var y=s.y+smoothY*10*s.z;

    ctx.beginPath();

    ctx.fillStyle=
      "rgba(255,210,238,"+
      (alpha*s.z)+")";

    ctx.shadowBlur=s.z>.75?9:2;
    ctx.shadowColor="#ff68bb";

    ctx.arc(
      x,y,
      s.r*(.5+s.z),
      0,
      Math.PI*2
    );

    ctx.fill();

    if(s.z>.88 && alpha>.85){

      ctx.strokeStyle=
        "rgba(255,185,228,.55)";

      ctx.lineWidth=.6;

      ctx.beginPath();

      ctx.moveTo(x-6,y);
      ctx.lineTo(x+6,y);

      ctx.moveTo(x,y-6);
      ctx.lineTo(x,y+6);

      ctx.stroke();
    }
  }

  ctx.shadowBlur=0;
}

function drawParticles(t){

  for(var i=0;i<particles.length;i++){

    var p=particles[i];

    p.phase+=.01;

    p.x+=.08+p.z*.12;
    p.y+=Math.sin(p.phase)*.08;

    if(p.x>W+5)p.x=-5;

    var x=p.x+smoothX*12*p.z;
    var y=p.y+smoothY*7*p.z;

    var a=.2+.35*
      (.5+.5*Math.sin(p.phase*2+t));

    ctx.beginPath();

    ctx.fillStyle=
      "rgba(255,105,194,"+a+")";

    ctx.shadowBlur=5;
    ctx.shadowColor="#ff3da8";

    ctx.arc(
      x,y,
      p.r*(.5+p.z),
      0,
      Math.PI*2
    );

    ctx.fill();
  }

  ctx.shadowBlur=0;
}

function drawMeteors(){

  for(var i=0;i<meteors.length;i++){

    var m=meteors[i];

    m.x+=m.vx;
    m.y+=m.vy;

    if(
      m.x<-150 ||
      m.y>H+100
    ){
      meteors[i]=meteor();
      continue;
    }

    var g=ctx.createLinearGradient(
      m.x,m.y,
      m.x+m.length,
      m.y-m.length*.5
    );

    g.addColorStop(
      0,
      "rgba(255,240,250,.95)"
    );

    g.addColorStop(
      .25,
      "rgba(255,135,215,.65)"
    );

    g.addColorStop(
      1,
      "rgba(255,60,170,0)"
    );

    ctx.strokeStyle=g;
    ctx.lineWidth=1.2;

    ctx.beginPath();

    ctx.moveTo(m.x,m.y);

    ctx.lineTo(
      m.x+m.length,
      m.y-m.length*.5
    );

    ctx.stroke();
  }
}

function animation(time){

  var t=time*.001;

  smoothX+=(tiltX-smoothX)*.035;
  smoothY+=(tiltY-smoothY)*.035;

  drawBackground(t);
  drawStars(t);
  drawParticles(t);
  drawMeteors();

  requestAnimationFrame(animation);
}

/* IMPORTANTE:
   Usamos touchend + click para iPhone.
   El preventDefault evita que Safari interprete
   el toque como navegación/selección. */

function enter(){

  if(started)return;

  started=true;

  iniciarMusica();

  var intro=document.getElementById("intro");

  intro.classList.add("hide");

  setTimeout(function(){

    document
      .getElementById("message")
      .classList
      .add("show");

    iniciarFrases();

  },1200);
}


/* ===== MÚSICA PARA iPHONE =====
   El audio se crea y reproduce dentro del toque del botón,
   que es la forma compatible con la política de autoplay de iOS.
   Coloca tu archivo en assets/musica.mp3
*/
var musica = null;

function iniciarMusica(){
  try{
    if(!musica){
      musica = new Audio("assets/timeless.mp3");
      musica.loop = true;
      musica.volume = 0.55;
      musica.playsInline = true;
    }

    var promesa = musica.play();

    if(promesa && promesa.catch){
      promesa.catch(function(){});
    }
  }catch(error){}
}


/* ===== FRASES: 5 segundos cada una ===== */
var phraseTimerStarted = false;

function iniciarFrases(){
  if(phraseTimerStarted) return;
  phraseTimerStarted = true;

  var frases = document.querySelectorAll("#phrases .phrase");
  var actual = 0;
  var duracion = 5000;

  function mostrarSiguiente(){
    if(actual >= frases.length - 1) return;

    frases[actual].classList.remove("active");
    actual++;
    frases[actual].classList.add("active");

    if(actual < frases.length - 1){
      window.setTimeout(mostrarSiguiente, duracion);
    }
  }

  window.setTimeout(mostrarSiguiente, duracion);
}

var button=document.getElementById("enter");

button.addEventListener(
  "touchend",
  function(e){
    e.preventDefault();
    enter();
  },
  {passive:false}
);

button.addEventListener(
  "click",
  function(e){
    e.preventDefault();
    enter();
  }
);

/* Parallax sin necesitar permisos de giroscopio. */

document.addEventListener(
  "touchmove",
  function(e){

    if(!e.touches.length)return;

    var touch=e.touches[0];

    tiltX=(touch.clientX-W/2)/W*2;
    tiltY=(touch.clientY-H/2)/H*2;

  },
  {passive:true}
);

window.addEventListener("resize",resize);

resize();
requestAnimationFrame(animation);

})();