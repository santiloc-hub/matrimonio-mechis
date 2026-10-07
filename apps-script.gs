/**
 * Boda Melquisedec & Briyith — Receptor de Confirmaciones (RSVP)
 * 
 * Este archivo contiene el código backend que se debe pegar en Google Apps Script
 * vinculado a tu hoja de cálculo de Google Sheets.
 *
 * ── PASOS PARA CONFIGURAR EN 2 MINUTOS ──────────────────────────────────
 * 1. Crea una hoja de cálculo nueva en Google Sheets (ej: "Confirmaciones Boda Melquisedec & Briyith").
 * 2. En el menú superior: Extensiones -> Apps Script.
 * 3. Borra el código de ejemplo que aparezca y pega TODO el contenido de este archivo.
 * 4. Si lo deseas, puedes cambiar el TOKEN por una clave propia (y poner la misma en js/config.js).
 * 5. Haz clic en "Implementar" (botón azul arriba a la derecha) -> "Nueva implementación".
 * 6. Selecciona tipo: "Aplicación web".
 *    - Descripción: "Backend RSVP Boda"
 *    - Ejecutar como: "Yo" (tu cuenta de correo)
 *    - Quién tiene acceso: "Cualquier persona" (¡IMPORTANTE! Los invitados deben poder enviar sin iniciar sesión).
 * 7. Haz clic en "Implementar", autoriza los permisos si te los pide.
 * 8. Copia la URL que termina en "/exec" y pégala en "js/config.js" en la constante SHEETS_URL.
 * 
 * La pestaña "Confirmaciones" en Google Sheets se crea automáticamente con cabeceras congeladas en el primer envío.
 */

const TOKEN = 'boda-melquisedec-briyith-2026';
const LARGO_MAX = 300;

function doPost(e) {
  // Evitar condiciones de carrera concurrentes si varios invitados confirman al mismo tiempo
  const cerrojo = LockService.getScriptLock();
  try {
    cerrojo.waitLock(20000); // Espera hasta 20 segundos
  } catch (err) {
    return responder({ ok: false, error: 'Servidor ocupado. Intenta de nuevo en unos segundos.' });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responder({ ok: false, error: 'Sin datos recibidos' });
    }

    const datos = JSON.parse(e.postData.contents);

    // Validación de seguridad por token
    if (datos.token !== TOKEN) {
      return responder({ ok: false, error: 'Token de seguridad no coincide' });
    }

    const nombre = limpiar(datos.nombre);
    if (!nombre) {
      return responder({ ok: false, error: 'Falta el nombre' });
    }

    const libro = SpreadsheetApp.getActiveSpreadsheet();
    const ahora = new Date();

    // Obtener o crear automáticamente la pestaña "Confirmaciones"
    const sheet = obtenerHoja(libro, 'Confirmaciones', [
      'Fecha y Hora',
      'Nombre del Asistente',
      'Estado de Asistencia',
      'Asignación / Grupo',
      'Mensaje o Nota'
    ]);

    sheet.appendRow([
      ahora,
      nombre,
      limpiar(datos.asistencia),
      limpiar(datos.personas),
      limpiar(datos.mensaje || '')
    ]);

    return responder({ ok: true });
  } catch (err) {
    return responder({ ok: false, error: String(err) });
  } finally {
    cerrojo.releaseLock();
  }
}

/** Comprobación de salud: al abrir la URL /exec en un navegador devuelve {"ok":true,"estado":"activo"} */
function doGet() {
  return responder({ ok: true, estado: 'activo', proyecto: 'Boda Melquisedec & Briyith' });
}

function limpiar(valor) {
  return String(valor == null ? '' : valor).trim().slice(0, LARGO_MAX);
}

function obtenerHoja(libro, nombre, cabecera) {
  let h = libro.getSheetByName(nombre);
  if (!h) {
    h = libro.insertSheet(nombre);
  }
  if (h.getLastRow() === 0) {
    h.appendRow(cabecera);
    h.setFrozenRows(1);
    
    // Formato estético a la cabecera
    const range = h.getRange(1, 1, 1, cabecera.length);
    range.setBackground('#f4e5df');
    range.setFontColor('#342724');
    range.setFontWeight('bold');
  }
  return h;
}

function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
