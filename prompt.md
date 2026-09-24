# Prompt para Copilot — Conexión con la API de Groq

Tengo un componente de chat en Next.js (App Router, TypeScript) ya construido
visualmente en `app/page.tsx`, con mensajes de ejemplo estáticos. Necesito que
conectes la lógica real a la API de Groq, siguiendo estas reglas obligatorias:

- La llamada debe hacerse con `fetch` nativo del navegador, NUNCA con el SDK de Groq ni ninguna librería externa.
- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Cabeceras: `Authorization: Bearer <API_KEY>` y `Content-Type: application/json`
- La API Key está en `process.env.NEXT_PUBLIC_GROQ_API_KEY`

Te paso este ejemplo en Python solo como referencia de los parámetros que acepta el modelo (no lo traduzcas literal, es solo para que conozcas el contrato de la API):

```python
from groq import Groq

client = Groq()
completion = client.chat.completions.create(
    model="qwen/qwen3.8-27b",
    messages=[
      {
        "role": "user",
        "content": ""
      }
    ],
    temperature=0.6,
    max_completion_tokens=2048,
    top_p=0.95,
    reasoning_effort="default",
    stream=True,
    stop=None
)

for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="")
```

Para mi proyecto usa `stream: false` (para simplificar el manejo de la respuesta en el frontend) y `reasoning_effort: "none"` (para respuestas más rápidas en un chat conversacional).

## Requisitos adicionales

- Envía siempre el historial completo de mensajes (`useState`), no solo el último turno.
- Usa `async/await` con un estado de carga mientras se espera la respuesta.
- Si la API responde con un error (status no 2xx), captúralo y muestra un mensaje legible en la interfaz, sin romper la app.
- Lee el objeto `usage` de la respuesta (`prompt_tokens`, `completion_tokens`, `total_tokens`) y acumúlalo en el estado para el panel de métricas que ya existe en la interfaz.
- Persiste el historial y las métricas en `localStorage` con `useEffect`, para que sobrevivan a una recarga de página.
- El botón "Borrar conversación" debe reiniciar el estado y limpiar `localStorage`.