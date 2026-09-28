
const menuBtn = document.querySelector('[data-menu]');
const navLinks = document.querySelector('.nav-links');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
}

document.querySelectorAll('.filter[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category.includes(filter)) ? '' : 'block';
    });
  });
});

const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox img');
if (lightbox) {
  document.querySelectorAll('[data-lightbox]').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.matches('[data-close]')) lightbox.classList.remove('open');
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        navLinks?.classList.remove('open');
      }
    }
  });
});
/* =========================================================
   INTERACTIVE SCIENCE CANVAS
   Data × Reality × Imagination
   ========================================================= */

(function(){

  const canvas = document.getElementById("science-canvas");

  if(!canvas) return;

  const ctx = canvas.getContext("2d");

  const panel = document.getElementById("interactive-science");

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  let animationFrame;

  /* ---------------------------------------------------------
     POINTER STATE
     --------------------------------------------------------- */

  const pointer = {
    x: 0,
    y: 0,
    previousX: 0,
    previousY: 0,

    velocity: 0,
    targetVelocity: 0,

    active: false,
    inside: false
  };


  /* ---------------------------------------------------------
     VISUAL OBJECTS
     --------------------------------------------------------- */

  const waves = [];
  const particles = [];
  const motes = [];
  const dataLines = [];
  const nodes = [];


  /* ---------------------------------------------------------
     SETTINGS
     --------------------------------------------------------- */

  const MAX_WAVES = 22;
  const MAX_PARTICLES = 420;
  const MAX_MOTES = 90;
  const MAX_NODES = 28;


  /* ---------------------------------------------------------
     UTILITY FUNCTIONS
     --------------------------------------------------------- */

  function random(min, max){
    return Math.random() * (max - min) + min;
  }

  function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
  }

  function distance(x1, y1, x2, y2){
    return Math.hypot(x2 - x1, y2 - y1);
  }

  function resize(){

    const rect = panel.getBoundingClientRect();

    width = rect.width;
    height = rect.height;

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createBackgroundData();

  }


  /* ---------------------------------------------------------
     COLOUR SYSTEM
     
     Speed controls hue:
     
     slow  → blue
     medium → cyan/green
     fast → yellow/orange
     extreme → pink/magenta
     --------------------------------------------------------- */

  function velocityToHue(speed){

    const normalized = clamp(speed / 2.2, 0, 1);

    /*
      Start around blue and travel through the spectrum.
    */

    return 210 - normalized * 300;
  }


  function velocityToAlpha(speed){

    return 0.15 + clamp(speed / 2.2, 0, 1) * 0.65;

  }


  /* ---------------------------------------------------------
     BACKGROUND DATA MOTIFS
     --------------------------------------------------------- */

  function createBackgroundData(){

    motes.length = 0;
    nodes.length = 0;
    dataLines.length = 0;

    /*
      Small data points
    */

    for(let i = 0; i < MAX_MOTES; i++){

      motes.push({
        x: random(0, width),
        y: random(0, height),
        r: random(.5, 1.5),
        alpha: random(.12, .4),
        phase: random(0, Math.PI * 2)
      });

    }


    /*
      Neural-network-like nodes
    */

    for(let i = 0; i < MAX_NODES; i++){

      nodes.push({
        x: random(width * .1, width * .9),
        y: random(height * .15, height * .82),
        r: random(1.5, 3),
        phase: random(0, Math.PI * 2)
      });

    }


    /*
      Abstract data curves
    */

    for(let i = 0; i < 5; i++){

      dataLines.push({
        y: height * random(.18, .85),
        amplitude: random(8, 22),
        frequency: random(.012, .028),
        phase: random(0, Math.PI * 2),
        alpha: random(.08, .18)
      });

    }

  }


  /* ---------------------------------------------------------
     BACKGROUND
     --------------------------------------------------------- */

  function drawBackground(time){

    /*
      Very subtle warm background.
    */

    ctx.clearRect(0, 0, width, height);


    /*
      Scientific coordinate grid
    */

    ctx.save();

    ctx.strokeStyle = "rgba(32,33,36,.055)";
    ctx.lineWidth = 1;

    const gridSize = 34;

    for(let x = 0; x < width; x += gridSize){

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

    }

    for(let y = 0; y < height; y += gridSize){

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

    }

    ctx.restore();


    /*
      Data points
    */

    ctx.save();

    for(const mote of motes){

      const pulse =
        Math.sin(time * .001 + mote.phase) * .25 + .75;

      ctx.beginPath();

      ctx.arc(
        mote.x,
        mote.y,
        mote.r,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(99,179,237,${mote.alpha * pulse})`;

      ctx.fill();

    }

    ctx.restore();


    /*
      Neural network / data network
    */

    ctx.save();

    for(let i = 0; i < nodes.length; i++){

      const a = nodes[i];

      for(let j = i + 1; j < nodes.length; j++){

        const b = nodes[j];

        const d = distance(a.x, a.y, b.x, b.y);

        if(d < 115){

          const opacity =
            (1 - d / 115) * .08;

          ctx.beginPath();

          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          ctx.strokeStyle =
            `rgba(32,33,36,${opacity})`;

          ctx.lineWidth = .7;

          ctx.stroke();

        }

      }

    }

    for(const node of nodes){

      ctx.beginPath();

      ctx.arc(
        node.x,
        node.y,
        node.r,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "rgba(243,166,200,.32)";

      ctx.fill();

    }

    ctx.restore();


    /*
      Seismic / mathematical data traces
    */

    ctx.save();

    for(const line of dataLines){

      ctx.beginPath();

      for(let x = 0; x <= width; x += 3){

        const y =
          line.y +
          Math.sin(
            x * line.frequency +
            time * .00025 +
            line.phase
          ) *
          line.amplitude;

        if(x === 0){
          ctx.moveTo(x, y);
        }else{
          ctx.lineTo(x, y);
        }

      }

      ctx.strokeStyle =
        `rgba(99,179,237,${line.alpha})`;

      ctx.lineWidth = .8;

      ctx.stroke();

    }

    ctx.restore();

  }


  /* ---------------------------------------------------------
     MOLECULAR STRUCTURE
     --------------------------------------------------------- */

  function drawMolecule(x, y, scale, alpha){

    ctx.save();

    ctx.globalAlpha = alpha;

    const atoms = [
      {x:0, y:0},
      {x:28, y:-15},
      {x:55, y:4},
      {x:38, y:30},
      {x:10, y:28}
    ];

    /*
      Bonds
    */

    ctx.strokeStyle = "rgba(32,33,36,.22)";
    ctx.lineWidth = 1;

    for(let i = 0; i < atoms.length; i++){

      const a = atoms[i];
      const b = atoms[(i + 1) % atoms.length];

      ctx.beginPath();

      ctx.moveTo(
        x + a.x * scale,
        y + a.y * scale
      );

      ctx.lineTo(
        x + b.x * scale,
        y + b.y * scale
      );

      ctx.stroke();

    }


    /*
      Atoms
    */

    atoms.forEach((atom, index) => {

      ctx.beginPath();

      ctx.arc(
        x + atom.x * scale,
        y + atom.y * scale,
        (index === 0 ? 5 : 3) * scale,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        index === 0
          ? "rgba(243,166,200,.45)"
          : "rgba(99,179,237,.35)";

      ctx.fill();

    });

    ctx.restore();

  }


  /* ---------------------------------------------------------
     SEISMIC WAVE
     --------------------------------------------------------- */

  function drawSeismicTrace(x, y, scale, alpha, time){

    ctx.save();

    ctx.globalAlpha = alpha;

    ctx.beginPath();

    const points = 90;

    for(let i = 0; i <= points; i++){

      const px =
        x + i * scale;

      let py =
        y +
        Math.sin(i * .34 + time * .002) *
        5 *
        scale;

      /*
        Main earthquake spike
      */

      if(i > 28 && i < 52){

        py +=
          Math.sin(i * 1.7) *
          16 *
          scale;

      }

      if(i === 0){

        ctx.moveTo(px, py);

      }else{

        ctx.lineTo(px, py);

      }

    }

    ctx.strokeStyle =
      "rgba(99,179,237,.7)";

    ctx.lineWidth = 1.2;

    ctx.stroke();

    ctx.restore();

  }


  /* ---------------------------------------------------------
     CREATE WAVE
     --------------------------------------------------------- */

  function createWave(x, y, speed){

    if(waves.length >= MAX_WAVES){

      waves.shift();

    }

    waves.push({

      x,
      y,

      radius: 4,

      speed:
        1.1 +
        speed * .9,

      life: 1,

      hue:
        velocityToHue(speed),

      thickness:
        1 +
        clamp(speed, 0, 2) * 1.2,

      distortion:
        random(.5, 1.5)

    });

  }


  /* ---------------------------------------------------------
     CREATE PARTICLES
     --------------------------------------------------------- */

  function createParticles(x, y, speed){

    const count =
      Math.floor(
        2 + clamp(speed * 7, 0, 14)
      );

    const hue =
      velocityToHue(speed);

    for(let i = 0; i < count; i++){

      if(particles.length >= MAX_PARTICLES){

        particles.shift();

      }

      const angle =
        random(0, Math.PI * 2);

      const force =
        random(.5, 2.8) *
        (0.5 + speed);

      particles.push({

        x,
        y,

        vx:
          Math.cos(angle) * force,

        vy:
          Math.sin(angle) * force,

        life: 1,

        decay:
          random(.008, .025),

        size:
          random(.7, 2.2),

        hue:
          hue + random(-25, 25)

      });

    }

  }


  /* ---------------------------------------------------------
     DRAW WAVES
     --------------------------------------------------------- */

  function drawWaves(){

    for(let i = waves.length - 1; i >= 0; i--){

      const wave = waves[i];

      wave.radius += wave.speed;

      wave.life *= .988;

      if(
        wave.life < .025 ||
        wave.radius > Math.max(width, height) * 1.2
      ){

        waves.splice(i, 1);

        continue;

      }

      ctx.save();

      ctx.globalAlpha =
        wave.life *
        velocityToAlpha(
          Math.abs(wave.speed - 1)
        );

      ctx.strokeStyle =
        `hsl(${wave.hue},85%,65%)`;

      ctx.lineWidth =
        wave.thickness *
        wave.life;

      /*
        Distorted wavefront
      */

      ctx.beginPath();

      const points = 100;

      for(let j = 0; j <= points; j++){

        const angle =
          (j / points) *
          Math.PI * 2;

        const distortion =
          Math.sin(
            angle * 5 +
            wave.radius * .025
          ) *
          4 *
          wave.distortion;

        const radius =
          wave.radius + distortion;

        const px =
          wave.x +
          Math.cos(angle) *
          radius;

        const py =
          wave.y +
          Math.sin(angle) *
          radius;

        if(j === 0){

          ctx.moveTo(px, py);

        }else{

          ctx.lineTo(px, py);

        }

      }

      ctx.closePath();
      ctx.stroke();

      /*
        Second ghost wave
      */

      ctx.globalAlpha *= .25;

      ctx.beginPath();

      ctx.arc(
        wave.x,
        wave.y,
        wave.radius + 9,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      ctx.restore();

    }

  }


  /* ---------------------------------------------------------
     DRAW PARTICLES
     --------------------------------------------------------- */

  function drawParticles(){

    for(let i = particles.length - 1; i >= 0; i--){

      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      p.vx *= .97;
      p.vy *= .97;

      p.life -= p.decay;

      if(p.life <= 0){

        particles.splice(i, 1);

        continue;

      }

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        p.size * p.life,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `hsla(${p.hue},90%,65%,${p.life * .7})`;

      ctx.fill();

    }

  }


  /* ---------------------------------------------------------
     POINTER
     --------------------------------------------------------- */

  function pointerMove(event){

    const rect =
      canvas.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const y =
      event.clientY - rect.top;


    if(!pointer.inside){

      pointer.previousX = x;
      pointer.previousY = y;

      pointer.inside = true;

    }


    const dx =
      x - pointer.previousX;

    const dy =
      y - pointer.previousY;

    const distanceMoved =
      Math.hypot(dx, dy);


    /*
      Velocity is based on pointer distance per frame.
    */

    pointer.targetVelocity =
      clamp(distanceMoved / 8, 0, 3);


    pointer.x = x;
    pointer.y = y;

    pointer.active = true;


    /*
      Create waves only when the pointer is actually moving.
    */

    if(distanceMoved > 1.5){

      createWave(
        x,
        y,
        pointer.targetVelocity
      );

      createParticles(
        x,
        y,
        pointer.targetVelocity
      );

    }


    pointer.previousX = x;
    pointer.previousY = y;

  }


  function pointerEnter(){

    pointer.active = true;
    pointer.inside = false;

  }


  function pointerLeave(){

    pointer.active = false;
    pointer.inside = false;

    pointer.targetVelocity = 0;

  }


  /* ---------------------------------------------------------
     EVENTS
     --------------------------------------------------------- */

  canvas.addEventListener(
    "pointermove",
    pointerMove,
    {passive:true}
  );

  canvas.addEventListener(
    "pointerenter",
    pointerEnter
  );

  canvas.addEventListener(
    "pointerleave",
    pointerLeave
  );


  /* ---------------------------------------------------------
     ANIMATION
     --------------------------------------------------------- */

  function animate(time){

    animationFrame =
      requestAnimationFrame(animate);


    /*
      Smooth velocity.
    */

    pointer.velocity +=
      (
        pointer.targetVelocity -
        pointer.velocity
      ) * .15;


    pointer.targetVelocity *= .91;


    drawBackground(time);


    /*
      Static scientific motifs.
    */

    drawMolecule(
      width * .72,
      height * .28,
      1,
      .35
    );

    drawMolecule(
      width * .22,
      height * .72,
      .7,
      .22
    );

    drawSeismicTrace(
      width * .14,
      height * .47,
      1.5,
      .3,
      time
    );


    /*
      Interactive layer.
    */

    drawWaves();

    drawParticles();

  }


  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */

  resize();

  window.addEventListener(
    "resize",
    resize
  );

  animate(0);


})();