/* ============================================================
   Boda Melquisedec & Briyith — Configuración del Backend Sheets
   ============================================================ */

/**
 * URL de la aplicación web de Google Apps Script. Termina en /exec
 * Conectada a la hoja de Google Sheets de la Boda.
 */
export const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzPgv-DubaKDDOw_olWkZUlzbITABRAu5g3o-qCtLfZP_cMk8xuA_Ug9ClesszJn5aD/exec';

/**
 * Token de seguridad que debe coincidir exactamente con el TOKEN en apps-script.gs
 */
export const SHEETS_TOKEN = 'boda-melquisedec-briyith-2026';

/**
 * Valor para detectar si aún no se ha pegado la URL real
 */
export const SHEETS_URL_SIN_CONFIGURAR = 'PEGA-AQUI-LA-URL-DEL-APPS-SCRIPT';

/**
 * Tiempo límite en milisegundos para la petición antes de timeout (10 segundos)
 */
export const TIMEOUT_MS = 10000;

/**
 * Teléfono para confirmar por WhatsApp si el usuario elige esa opción
 */
export const TELEFONO_WHATSAPP_NOVIOS = '573105508171';
