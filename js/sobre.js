/* ============================================================
   Sobre de apertura 3D - Boda Melquisedec & Briyith
   Basado en anime.js v4 (mismo motor de la invitación de Giseth)
   ============================================================ */

import { animate, createTimeline } from '../vendor/anime.esm.min.js';

/** @returns {Promise<void>} se resuelve cuando el sobre terminó y salió de pantalla */
export function abrirSobre() {
  const escena = document.getElementById('sobre');
  if (!escena) return Promise.resolve();

  if (new URLSearchParams(window.location.search).has('abierto')) {
    escena.remove();
    return Promise.resolve();
  }

  const boton = escena.querySelector('.sobre-abrir');
  const pista = escena.querySelector('.sobre-pista');
  const solapa = escena.querySelector('.sobre-solapa');
  const sello = escena.querySelector('.sobre-sello');
  const tarjeta = escena.querySelector('.sobre-tarjeta');
  const root = document.documentElement;

  root.classList.add('sobre-activo');

  return new Promise((resolve) => {
    let abierto = false;
    let latido = null;

    const terminar = () => {
      window.removeEventListener('keydown', porTecla);
      root.classList.remove('sobre-activo');
      escena.remove();
      resolve();
    };

    const abrir = () => {
      if (abierto) return;
      abierto = true;
      if (latido) latido.pause();

      const audio = document.getElementById('musica-boda');
      const btnMusica = document.getElementById('btn-musica');
      if (audio) {
        audio.volume = 0.4;
        audio.play().then(() => {
          if (btnMusica) {
            btnMusica.classList.remove('paused');
            btnMusica.classList.add('playing');
          }
        }).catch(() => {});
      }

      const tl = createTimeline({ defaults: { ease: 'outExpo' }, onComplete: terminar });

      // Botón y pista se desvanecen
      tl.add([boton, pista], { opacity: [1, 0], y: [0, 15], duration: 450 }, 0)
        // El sello de lacre dorado se agranda un instante y se disuelve
        .add(sello, { scale: [1, 1.25, 0], opacity: [1, 1, 0], duration: 550, ease: 'in(2)' }, 0)
        // La solapa gira en 3D sobre su eje superior
        .add(solapa, { rotateX: [0, -175], duration: 950, ease: 'inOut(2)' }, 350)
        // La tarjeta interior pasa al frente y sube hacia la pantalla
        .set(tarjeta, { zIndex: 6 }, 1100)
        .add(tarjeta, { y: ['0%', '-120%'], duration: 850 }, 1120)
        .add(tarjeta, { scale: [1, 1.8], opacity: [1, 0], duration: 950, ease: 'in(2)' }, 1750)
        // Fondo del sobre se desvanece
        .add(escena, { opacity: [1, 0], duration: 750 }, 1950);
    };

    const porTecla = (ev) => {
      if (ev.key === 'Escape') terminar();
    };

    escena.addEventListener('click', abrir);
    escena.addEventListener('touchstart', abrir, { passive: true });
    window.addEventListener('keydown', porTecla);

    if (boton) {
      boton.focus({ preventScroll: true });
      latido = animate(boton, {
        scale: [1, 1.05],
        duration: 1400,
        loop: true,
        alternate: true,
        ease: 'inOutSine'
      });
    }
  });
}
