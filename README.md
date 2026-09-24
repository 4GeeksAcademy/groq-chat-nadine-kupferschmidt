# Groqchat
 
Prototipo de interfaz de chat conectada a la API de Groq, con un panel que muestra en tiempo real el consumo de tokens de la sesión (prompt, completado, total) y otras métricas como el tiempo de respuesta.
 
## Características
 
- Interfaz de chat con historial de mensajes diferenciados por rol (usuario / agente).
- Conexión directa a la API de Groq mediante `fetch` (sin SDK de terceros).
- Envío del historial completo de la conversación en cada petición.
- Estado de carga ("pensando…") mientras se espera la respuesta del modelo.
- Manejo de errores de la API con mensajes claros para el usuario.
- Panel de estadísticas de consumo, acumuladas durante toda la sesión.
- Persistencia de la conversación en `localStorage`: sobrevive a una recarga de página.
- Botón para borrar la conversación y reiniciar el consumo.

## Instalación
 
```bash
npm install
```
 
## Uso
 
```bash
npm run dev
```
 
Abre [http://localhost:3000](http://localhost:3000) en el navegador.
 
Otros comandos disponibles:
 
```bash
npm run build   # compila la versión de producción
npm run start   # sirve la build de producción (requiere haber corrido build antes)
npm run lint    # revisa el código con ESLint
```
