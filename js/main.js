/* ============================================================
   Boda Melquisedec & Briyith — Animaciones y Funcionalidad
   Inspirado en la estructura de Giseth, con motor anime.js v4.5.0
   ============================================================ */

import { animate, createTimeline, stagger } from '../vendor/anime.esm.min.js';
import { abrirSobre } from './sobre.js';

const root = document.documentElement;
const motion = root.classList.contains('js-motion');

const D_FAST = 400;
const D_BASE = 700;
const D_SLOW = 1200;
const STAGGER = 50;

/* ── 1. Inicialización de Audio ────────────────────────────── */
function initMusica() {
  const audio = document.getElementById('musica-boda');
  const btn = document.getElementById('btn-musica');
  if (!audio || !btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      audio.play().then(() => {
        btn.classList.remove('paused');
        btn.classList.add('playing');
      }).catch(err => console.log('Audio blocked:', err));
    } else {
      audio.pause();
      btn.classList.remove('playing');
      btn.classList.add('paused');
    }
  });
}

/* ── 2. Cuenta Regresiva ───────────────────────────────────────
   Boda: 19 de Diciembre de 2026, 3:00 PM (15:00 UTC-5 -> 20:00 UTC) */
function initCountdown() {
  const target = Date.UTC(2026, 11, 19, 20, 0, 0);
  const units = {
    d: document.getElementById('d'),
    h: document.getElementById('h'),
    m: document.getElementById('m'),
    s: document.getElementById('s')
  };
  if (!units.d) return;

  const pad = (n) => (n < 10 ? '0' + n : String(n));
  const previo = {};
  let reloj = null;

  function tick() {
    const dif = target - Date.now();
    const valores = dif <= 0
      ? { d: '00', h: '00', m: '00', s: '00' }
      : {
          d: pad(Math.floor(dif / 86400000)),
          h: pad(Math.floor(dif / 3600000) % 24),
          m: pad(Math.floor(dif / 60000) % 60),
          s: pad(Math.floor(dif / 1000) % 60)
        };

    for (const clave of ['d', 'h', 'm', 's']) {
      if (valores[clave] === previo[clave]) continue;
      units[clave].textContent = valores[clave];
      previo[clave] = valores[clave];
      if (motion) {
        animate(units[clave], {
          scale: [1.18, 1],
          duration: D_FAST,
          ease: 'outExpo'
        });
      }
    }
    if (dif <= 0 && reloj) clearInterval(reloj);
  }

  tick();
  reloj = setInterval(tick, 1000);
}

/* ── 3. Destellos y Rayos Dorados en el Hero ────────────────── */
function initHeroGlints() {
  const svg = document.querySelector('.rays');
  if (!svg) return;

  const cantidad = 12;
  const cx = 100;
  const cy = 100;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < cantidad; i++) {
    const angulo = (i / cantidad) * Math.PI * 2 + (Math.random() * 0.2);
    const r1 = 65 + Math.random() * 10;
    const r2 = 95 + Math.random() * 20;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx + Math.cos(angulo) * r1);
    line.setAttribute('y1', cy + Math.sin(angulo) * r1);
    line.setAttribute('x2', cx + Math.cos(angulo) * r2);
    line.setAttribute('y2', cy + Math.sin(angulo) * r2);
    line.setAttribute('class', i % 2 === 0 ? 'ray ray--gold' : 'ray ray--light');
    line.setAttribute('stroke-width', (1 + Math.random() * 1.5).toFixed(1));
    fragment.appendChild(line);
  }

  svg.appendChild(fragment);

  if (motion) {
    const rayos = svg.querySelectorAll('.ray');
    animate(rayos, {
      opacity: [0, 0.8, 0],
      duration: () => 1400 + Math.random() * 1200,
      delay: stagger(150),
      loop: true,
      ease: 'inOutSine'
    });
  }
}

/* ── 4. Acordeones y Secciones Desplegables ──────────────────── */
function initDesplegables() {
  const collapsibles = document.querySelectorAll('.desplegable');

  collapsibles.forEach((card) => {
    const header = card.querySelector('.desplegable-header');
    const content = card.querySelector('.desplegable-content');
    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('abierto');

      // Animación suave de apertura/cierre
      if (isOpen) {
        card.classList.remove('abierto');
        if (motion) {
          animate(content, {
            opacity: [1, 0],
            duration: 250,
            ease: 'outExpo',
            onComplete: () => {
              content.style.display = 'none';
            }
          });
        } else {
          content.style.display = 'none';
        }
      } else {
        card.classList.add('abierto');
        content.style.display = 'block';
        if (motion) {
          animate(content, {
            opacity: [0, 1],
            y: [-10, 0],
            duration: 350,
            ease: 'outExpo'
          });
        }
      }
    });
  });
}

/* ── 5. Revelación por Scroll (Scroll Reveal) ───────────────── */
function initScrollReveal() {
  if (!motion) return;

  const revelables = document.querySelectorAll('[data-reveal], [data-stagger]');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);

      const el = entry.target;
      if (el.hasAttribute('data-stagger')) {
        const hijos = el.querySelectorAll(':scope > *:not(svg)');
        animate(hijos, {
          opacity: [0, 1],
          y: [20, 0],
          duration: D_BASE,
          delay: stagger(STAGGER),
          ease: 'outExpo'
        });
      } else {
        animate(el, {
          opacity: [0, 1],
          y: [24, 0],
          duration: D_BASE,
          ease: 'outExpo'
        });
      }
    });
  }, { threshold: 0.15 });

  revelables.forEach(el => observer.observe(el));
}

/* ── 6. Formulario RSVP con Dinamismo y WhatsApp ─────────────── */
function initRSVP() {
  const campoAsistencia = document.getElementById('asistencia');
  const campoAcomp = document.getElementById('acomp');
  const grupoAcomp = document.getElementById('grupo-acomp');
  const contenedor = document.getElementById('contenedor-asistentes');
  const btnWA = document.getElementById('enviar-wa');
  const cajaConfirm = document.getElementById('confirm');

  if (!campoAsistencia || !campoAcomp || !contenedor || !btnWA) return;

  const renderizarCampos = () => {
    const esRechazo = campoAsistencia.value === 'no';
    if (grupoAcomp) {
      grupoAcomp.style.display = esRechazo ? 'none' : 'block';
    }

    const cantidad = esRechazo ? 1 : Math.max(1, parseInt(campoAcomp.value, 10) || 1);
    const valoresActuales = Array.from(contenedor.querySelectorAll('.input-asistente')).map(inp => inp.value);

    contenedor.innerHTML = '';

    for (let i = 0; i < cantidad; i++) {
      const field = document.createElement('div');
      field.className = 'field asistente-item';

      const label = document.createElement('label');
      label.htmlFor = `asistente-${i + 1}`;

      if (esRechazo) {
        label.innerHTML = 'Tu nombre completo <span class="asistente-tag tag-excusa">Excusa</span>';
      } else if (i === 0) {
        label.innerHTML = 'Nombre Persona 1 (Titular) <span class="asistente-tag">Titular</span>';
      } else {
        label.textContent = `Nombre Persona ${i + 1} (Acompañante)`;
      }

      const input = document.createElement('input');
      input.type = 'text';
      input.id = `asistente-${i + 1}`;
      input.className = 'input-asistente';
      input.placeholder = i === 0 ? 'Ej: Juan Pérez y familia' : `Nombre del acompañante ${i}`;
      input.value = valoresActuales[i] || '';

      field.appendChild(label);
      field.appendChild(input);
      contenedor.appendChild(field);
    }

    if (motion) {
      animate(contenedor.querySelectorAll('.asistente-item'), {
        opacity: [0, 1],
        y: [8, 0],
        duration: D_FAST,
        delay: stagger(40),
        ease: 'outExpo'
      });
    }
  };

  campoAsistencia.addEventListener('change', renderizarCampos);
  campoAcomp.addEventListener('change', renderizarCampos);
  renderizarCampos();

  // Enviar a WhatsApp
  btnWA.addEventListener('click', () => {
    const inputs = Array.from(contenedor.querySelectorAll('.input-asistente'));
    const nombres = inputs.map(i => i.value.trim()).filter(Boolean);

    if (nombres.length === 0) {
      cajaConfirm.textContent = 'Por favor escribe al menos el nombre de la persona titular.';
      cajaConfirm.className = 'confirm on err';
      inputs[0]?.focus();
      return;
    }

    const estadoMap = {
      'si': '¡Sí, con mucha alegría confirmamos nuestra asistencia!',
      'tarde': 'Llegaremos un poco tarde a la recepción, pero ahí estaremos para celebrar con ustedes.',
      'no': 'Lamentablemente no podremos acompañarlos en esta ocasión, pero les deseamos la mayor bendición.'
    };

    const estadoTxt = estadoMap[campoAsistencia.value] || 'Confirmación de asistencia';
    const listaNombres = nombres.map((n, idx) => `• ${n}`).join('\n');

    const mensaje = `💍 *CONFIRMACIÓN DE ASISTENCIA — BODA MELQUISEDEC & BRIYITH*\n\n` +
      `*Estado:* ${estadoTxt}\n\n` +
      `*Personas confirmadas (${nombres.length}):*\n${listaNombres}\n\n` +
      `¡Muchas felicidades y bendiciones en su matrimonio! ✨`;

    // Número de contacto de los novios
    const telefonoNovios = '573100000000';
    const urlWA = `https://wa.me/${telefonoNovios}?text=${encodeURIComponent(mensaje)}`;

    cajaConfirm.textContent = '¡Redirigiendo a WhatsApp para enviar tu confirmación!';
    cajaConfirm.className = 'confirm on';

    setTimeout(() => {
      window.open(urlWA, '_blank');
    }, 600);
  });
}

/* ── 7. Arranque Global ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initMusica();
  initCountdown();
  initHeroGlints();
  initDesplegables();
  initRSVP();

  // Apertura de sobre en 3D
  await abrirSobre();

  // Una vez abierto el sobre, activamos las animaciones de la página
  root.classList.add('js-motion-ready');
  initScrollReveal();

  // Animación de entrada triunfal del Hero
  if (motion) {
    const heroElements = document.querySelectorAll('.hero .kicker, .hero h1, .hero .couple-script, .hero .wedding-date, .hero .hero-sub');
    animate(heroElements, {
      opacity: [0, 1],
      y: [25, 0],
      duration: D_BASE,
      delay: stagger(90),
      ease: 'outExpo'
    });
  }
});
