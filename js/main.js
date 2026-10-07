/* ============================================================
   Boda Melquisedec & Briyith — Animaciones y Funcionalidad
   Inspirado en la estructura de Giseth, con motor anime.js v4.5.0
   ============================================================ */

import { animate, createTimeline, stagger } from '../vendor/anime.esm.min.js';
import { abrirSobre } from './sobre.js';
import {
  SHEETS_URL,
  SHEETS_TOKEN,
  SHEETS_URL_SIN_CONFIGURAR,
  TIMEOUT_MS,
  TELEFONO_WHATSAPP_NOVIOS
} from './config.js';

const root = document.documentElement;
const motion = root.classList.contains('js-motion');

const D_FAST = 400;
const D_BASE = 700;
const D_SLOW = 1200;
const STAGGER = 50;

/* ── 0. Envío a Google Sheets (Simple Request text/plain para evitar CORS) ── */
async function enviarASheets(datos) {
  const control = new AbortController();
  const timer = setTimeout(() => control.abort(), TIMEOUT_MS);

  try {
    const respuesta = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(datos),
      signal: control.signal
    });
    clearTimeout(timer);

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    const resultado = await respuesta.json();
    if (!resultado.ok) {
      throw new Error(resultado.error || 'Respuesta negativa');
    }
    return resultado;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

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

/* ── 5. Revelación por Scroll (Scroll Reveal una sola vez, quedan fijas) ── */
function initScrollReveal() {
  if (!motion) return;

  // 5.1 Textos, títulos y tarjetas (aparecen al bajar la primera vez y quedan fijos)
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
          ease: 'outExpo',
          onComplete: () => {
            hijos.forEach(h => {
              h.style.opacity = '1';
              h.style.transform = 'none';
            });
          }
        });
      } else {
        animate(el, {
          opacity: [0, 1],
          y: [24, 0],
          duration: D_BASE,
          ease: 'outExpo',
          onComplete: () => {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
        });
      }
    });
  }, { threshold: 0.12 });

  revelables.forEach(el => observer.observe(el));

  // 5.2 Espigas y rosas laterales (se revelan suavemente una vez y quedan fijas)
  const laterales = document.querySelectorAll('[data-reveal-side]');
  const lateralObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el = entry.target;
      const side = el.getAttribute('data-reveal-side'); // 'left' o 'right'
      const startX = side === 'left' ? -45 : 45;

      animate(el, {
        opacity: [0, 1],
        translateX: [startX, 0],
        translateY: [24, 0],
        scale: [0.93, 1],
        duration: 1200,
        ease: 'outExpo',
        onComplete: () => {
          el.classList.add('revelado');
        }
      });
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  laterales.forEach(el => lateralObserver.observe(el));
}

/* ── 6. Formulario RSVP con Backend Sheets y WhatsApp Dual ─── */
function initRSVP() {
  const campoAsistencia = document.getElementById('asistencia');
  const campoAcomp = document.getElementById('acomp');
  const grupoAcomp = document.getElementById('grupo-acomp');
  const contenedor = document.getElementById('contenedor-asistentes');
  const btnEnviar = document.getElementById('enviar');
  const btnWA = document.getElementById('enviar-wa');
  const cajaConfirm = document.getElementById('confirm');

  const campoMensaje = document.getElementById('mensaje-novios');

  if (!campoAsistencia || !campoAcomp || !contenedor) return;

  let enviando = false;
  let registrado = false;

  const notificar = (texto, esError = false) => {
    cajaConfirm.textContent = texto;
    cajaConfirm.className = `confirm on ${esError ? 'err' : ''}`;
    if (motion) {
      animate(cajaConfirm, { opacity: [0, 1], y: [6, 0], duration: D_FAST, ease: 'outExpo' });
    }
  };

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
      input.placeholder = i === 0 ? 'Ej: Juan Pérez y familia' : `Nombre del acompañante ${i + 1}`;
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

  // Validación y obtención de lista completa de asistentes
  const obtenerNombres = () => {
    const inputs = Array.from(contenedor.querySelectorAll('.input-asistente'));
    const nombres = inputs.map(i => i.value.trim());

    if (!nombres[0]) {
      notificar('Por favor escribe al menos el nombre de la Persona 1 (Titular).', true);
      inputs[0]?.focus();
      return null;
    }

    const indiceFaltante = nombres.findIndex(n => !n);
    if (indiceFaltante !== -1) {
      notificar(`Por favor escribe el nombre de la Persona ${indiceFaltante + 1}.`, true);
      inputs[indiceFaltante]?.focus();
      return null;
    }

    return nombres;
  };

  // 1. Envío directo a Google Sheets
  if (btnEnviar) {
    btnEnviar.addEventListener('click', async () => {
      if (enviando || registrado) return;

      const nombres = obtenerNombres();
      if (!nombres) return;

      if (SHEETS_URL === SHEETS_URL_SIN_CONFIGURAR) {
        notificar('Aún no se ha vinculado la URL de Google Sheets en js/config.js. Puedes usar mientras tanto el botón de WhatsApp.', true);
        return;
      }

      const esRechazo = campoAsistencia.value === 'no';
      const textoAsistencia = campoAsistencia.options[campoAsistencia.selectedIndex].text;
      const titular = nombres[0];
      const total = nombres.length;
      const notaMensaje = campoMensaje ? campoMensaje.value.trim() : '';

      enviando = true;
      btnEnviar.disabled = true;
      btnEnviar.textContent = 'Guardando en la lista…';

      try {
        for (let i = 0; i < total; i++) {
          const asignacion = esRechazo
            ? 'No asiste'
            : (total === 1 ? 'Solo titular (1 persona)' : `Puesto ${i + 1} de ${total} (Grupo: ${titular})`);

          await enviarASheets({
            token: SHEETS_TOKEN,
            nombre: nombres[i],
            asistencia: textoAsistencia,
            personas: asignacion,
            mensaje: notaMensaje
          });
        }

        registrado = true;
        btnEnviar.textContent = '✓ ¡Registrado con éxito!';
        campoAsistencia.disabled = true;
        campoAcomp.disabled = true;
        if (campoMensaje) campoMensaje.disabled = true;
        contenedor.querySelectorAll('input').forEach(inp => { inp.disabled = true; });
        notificar(`¡Muchas gracias, ${titular.split(' ')[0]}! Tu respuesta quedó registrada en la lista oficial.`);
      } catch (err) {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Reintentar confirmación';
        notificar('Hubo un inconveniente al conectar con la lista. Por favor reintenta o confirma vía WhatsApp.', true);
      } finally {
        enviando = false;
      }
    });
  }

  // 2. Envío a WhatsApp (con mensaje dinámico por estado y copia desatendida a Sheets)
  if (btnWA) {
    btnWA.addEventListener('click', () => {
      const nombres = obtenerNombres();
      if (!nombres) return;

      const valAsistencia = campoAsistencia.value;
      const mensajeNovios = campoMensaje ? campoMensaje.value.trim() : '';
      const total = nombres.length;
      const personasTxt = total === 1 ? '1 persona' : `${total} personas`;
      const listaNombres = nombres.map((n, idx) => `${idx + 1}. ${n}`).join('\n');

      let mensaje = '';

      if (valAsistencia === 'si') {
        mensaje = `💍 *CONFIRMACIÓN DE ASISTENCIA — BODA MELQUISEDEC & BRIYITH*\n\n` +
          `¡Hola Melquisedec y Briyith! ✨\n` +
          `Queremos confirmar con gran alegría que *SÍ los acompañaremos* en la celebración de su matrimonio.\n\n` +
          `📋 *Detalles de la confirmación:*\n` +
          `• *Titular:* ${nombres[0]}\n` +
          `• *Total de asistentes:* ${personasTxt}\n\n` +
          `👥 *Lista de invitados:*\n${listaNombres}\n\n`;

        if (mensajeNovios) {
          mensaje += `💌 *Mensaje / Dedicatoria:*\n"${mensajeNovios}"\n\n`;
        }

        mensaje += `¡Estamos muy emocionados de compartir este día tan especial junto a ustedes! Que Dios bendiga su nuevo hogar. 🥂✨`;

      } else if (valAsistencia === 'tarde') {
        mensaje = `💍 *CONFIRMACIÓN DE ASISTENCIA — BODA MELQUISEDEC & BRIYITH*\n\n` +
          `¡Hola Melquisedec y Briyith! ✨\n` +
          `Confirmamos nuestra asistencia a su boda. *Llegaremos un poco más tarde, directamente a la recepción* para celebrar y brindar con ustedes en la Hacienda Bella Luna.\n\n` +
          `📋 *Detalles de la confirmación:*\n` +
          `• *Titular:* ${nombres[0]}\n` +
          `• *Total de asistentes:* ${personasTxt}\n\n` +
          `👥 *Lista de invitados:*\n${listaNombres}\n\n`;

        if (mensajeNovios) {
          mensaje += `💌 *Mensaje / Dedicatoria:*\n"${mensajeNovios}"\n\n`;
        }

        mensaje += `¡Con todo el cariño del mundo para celebrar este gran momento! Muchas bendiciones en su matrimonio. 🥂✨`;

      } else {
        // Rechazo cordial / Excusa
        mensaje = `🕊️ *RESPUESTA DE INVITACIÓN — BODA MELQUISEDEC & BRIYITH*\n\n` +
          `¡Hola Melquisedec y Briyith! ✨\n` +
          `Agradecemos de todo corazón la hermosa invitación a su matrimonio.\n\n` +
          `Lamentablemente en esta ocasión *no podremos acompañarlos físicamente* a la celebración.\n\n` +
          `📋 *Datos:*\n` +
          `• *Nombre:* ${nombres[0]}\n\n`;

        if (mensajeNovios) {
          mensaje += `💌 *Mensaje / Dedicatoria:*\n"${mensajeNovios}"\n\n`;
        }

        mensaje += `Aunque no podamos estar presentes, les enviamos todo nuestro cariño, admiración y los mejores deseos en esta nueva etapa que inician. ¡Que Dios bendiga grandemente su unión y su hogar! 🤍✨`;
      }

      const urlWA = `https://wa.me/${TELEFONO_WHATSAPP_NOVIOS}?text=${encodeURIComponent(mensaje)}`;

      // Si Sheets ya está configurado, guardamos silenciosamente en segundo plano
      if (SHEETS_URL !== SHEETS_URL_SIN_CONFIGURAR && !registrado) {
        const esRechazo = valAsistencia === 'no';
        const titular = nombres[0];
        const textoAsistencia = campoAsistencia.options[campoAsistencia.selectedIndex].text;
        for (let i = 0; i < total; i++) {
          const asignacion = esRechazo
            ? 'No asiste'
            : (total === 1 ? 'Solo titular (1 persona)' : `Puesto ${i + 1} de ${total} (Grupo: ${titular})`);
          enviarASheets({
            token: SHEETS_TOKEN,
            nombre: nombres[i],
            asistencia: textoAsistencia,
            personas: asignacion,
            mensaje: mensajeNovios
          }).catch(() => {});
        }
      }

      notificar('¡Redirigiendo a WhatsApp para enviar tu confirmación!');
      setTimeout(() => {
        window.open(urlWA, '_blank');
      }, 500);
    });
  }
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
