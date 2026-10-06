# Invitación Matrimonio Melquisedec & Briyith ("Matrimonio Mechis")

Este directorio contiene la ingeniería inversa, extracción de recursos multimedia, desglose en HTML del timeline y la réplica web interactiva a partir del video vertical de WhatsApp (`WhatsApp Video 2026-10-05 at 1.20.46 PM.mp4`).

---

## 📁 Estructura del Proyecto

```text
matrimonio mechis/
├── index.html                 # Réplica web interactiva (Sobre virtual, música, cuenta regresiva, mapas)
├── timeline.html              # Documento visual del timeline escena por escena con audio y capturas
├── README.md                  # Especificaciones de diseño, tipografía y paleta
└── assets/
    ├── audio/
    │   └── musica_fondo.mp3   # Canción romántica extraída ("Prometo" - balada nupcial)
    ├── frames/                # Fotogramas clave en resolución completa (720x1280)
    │   ├── 01_sobre_cerrado.png
    │   ├── 02_nuestra_boda.png
    │   ├── 03_versiculo.png
    │   ├── 04_bendicion_padres.png
    │   ├── 05_nos_casamos.png
    │   ├── 06_ceremonia_recepcion.png
    │   ├── 07_vestimenta_sobres.png
    │   └── 08_te_esperamos.png
    └── images/                # Recortes aislados de fotos (iglesia, pareja, anillos)
        ├── foto_iglesia_nobsa.png
        ├── foto_pareja_atardecer.png
        ├── foto_anillos.png
        ├── foto_pareja_frente.png
        ├── corona_espigas_marco.png      # Corona de pampas/espigas en PNG transparente
        ├── espigas_borde_lateral.png    # Guirnalda vertical de espigas y pampas para bordes
        └── espigas_borde_lateral_2.png  # Variante 2 con rosas champagne y espigas para bordes
```

---

## 🎨 Especificaciones de Diseño y Tipografía

### 1. Paleta de Colores
- **Oro / Dorado Principal:** `#bfa15f` / `#c59b58` (acentos, marcos y botones)
- **Oro Oscuro / Títulos:** `#8c6f32` / `#997334`
- **Fondo Marfil / Crema:** `#f9f5f0` / `#faf7f2`
- **Rosa Palo / Empolvado:** `#fceee8` / `#e8c5be` (sobre y acuarelas)
- **Texto Principal (Marrón Cálido Elegante):** `#4b3e3c` / `#5c4a42`

### 2. Tipografías Empleadas (Google Fonts)
- **Script / Caligráfica:** `Great Vibes` (o `Pinyon Script`) para los nombres de los novios, "Nuestra Boda", "Nos Casamos", "Ceremonia", "Recepción".
- **Serif Clásica:** `Cormorant Garamond` (o `Playfair Display`) para textos solemnes, versículo bíblico y nombres de padres.
- **Sans-Serif Moderna:** `Montserrat` para horarios, direcciones y botones.

---

## ⏱️ Línea de Tiempo del Video (80 segundos)

| Segundo | Escena | Contenido |
|---|---|---|
| **00:00 - 00:02** | Apertura de Sobre | Sobre rosa nude con lacre dorado y ramas de hojas doradas. |
| **00:02 - 00:09** | Portada Oficial | Foto al atardecer de espaldas, corona de pampas grass, "Nuestra Boda", nombres y fecha (19/Dic/2026). |
| **00:10 - 00:22** | Versículo Bíblico | Marco floral acuarelado: *"El amor nunca se da por vencido..."* (1 Corintios 13:7). |
| **00:23 - 00:35** | Familias y Padrinos | *"Con la bendición de Dios y nuestros padres"* (Padres de novio, novia y padrinos). |
| **00:36 - 00:46** | Las Alianzas | Foto de manos entrelazadas con argollas, 3:00 PM, 19 DIC 2026. |
| **00:47 - 00:58** | Ceremonia y Recepción | Iglesia San Jerónimo de Nobsa (3:00 PM) + Hacienda Bella Luna (5:30 PM). |
| **00:59 - 01:10** | Protocolo | Vestimenta: Formal (Traje/Vestido) + Lluvia de Sobres. |
| **01:11 - 01:20** | Despedida | *"TE ESPERAMOS"* con foto de los novios sonriendo de frente. |

---

## 🚀 Cómo Visualizarlo

### Servidor Local Recomendado
Para visualizar con todos los módulos de audio y animaciones 3D activas:
```bash
node server.cjs
```
Y abre en tu navegador:
- Invitación oficial con sobre interactivo: **http://localhost:8080**
- Vista previa directa (sin esperar sobre): **http://localhost:8080?abierto=1**
- Timeline comparativo escena por escena: **http://localhost:8080/timeline.html**

