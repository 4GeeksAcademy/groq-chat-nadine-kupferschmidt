# Notas de estudio — Conexión con la API de Groq

> Este archivo es material de estudio personal. Explica cómo funciona la
> conexión con Groq en `app/page.tsx`, línea por línea, con lenguaje sencillo
> y fragmentos de código reales.

---

## 1. Flujo general — paso a paso

Cuando escribís un mensaje y presionás Enter, pasa esto:

```
1. El textarea detecta la tecla Enter y llama a onSend(texto)
2. El mensaje del usuario se agrega al array messages (con role: "user")
3. Se enciende isLoading = true → aparece "Pensando…" en pantalla
4. Se arma el body de la petición con TODO el historial de mensajes
5. Se hace fetch() a la API de Groq
6. Si la respuesta es exitosa:
   a. Se extrae el texto de la respuesta (choices[0].message.content)
   b. Se extrae el objeto usage (prompt_tokens, completion_tokens, etc.)
   c. Se agrega el mensaje del asistente al array messages
   d. Se acumulan los tokens en usageStats
7. Si la respuesta falla: se guarda el error en el estado error
8. Se apaga isLoading = false
```

### El código que inicia todo:

```typescript
const handleSend = useCallback(async (content: string) => {
  const trimmed = content.trim()
  if (!trimmed || isLoading) return

  setError(null)

  const userMessage: ChatMessage = {
    id: generateId(),
    role: "user",
    content: trimmed,
  }

  const updatedMessages = [...messagesRef.current, userMessage]
  setMessages(updatedMessages)
  setIsLoading(true)

  const t0 = performance.now()
  // ... sigue con el fetch ...
```

**Explicación:** Lo primero que hace es limpiar el texto con `.trim()`. Si el usuario mandó solo espacios, no hace nada. Después crea un objeto `ChatMessage` con un ID único y lo agrega al array. `setIsLoading(true)` activa el indicador visual de "cargando" en la UI. La variable `t0` guarda el timestamp de inicio para medir después cuánto tardó la respuesta.

---

## 2. Estado — qué guarda cada variable

En la cabecera del componente hay 4 variables de estado principales:

```typescript
const [messages, setMessages] = useState<ChatMessage[]>([])
const [usageStats, setUsageStats] = useState<UsageStats>(emptyStats)
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

### messages
Guarda **todos los mensajes** de la conversación: los tuyos y los del asistente. Cada mensaje tiene un `id`, un `role` ("user" o "assistant"), el `content` (texto), y opcionalmente `meta` (solo en respuestas del asistente) con métricas como tokens consumidos. Sirve para renderizar la lista de mensajes y también se envía completa a la API.

### usageStats
Acumula las métricas de **toda la sesión**: total de tokens de entrada, de salida, intercambios realizados, tiempo y velocidad de la última respuesta. Es lo que alimenta el panel lateral de estadísticas (`StatsSidebar`).

### isLoading
Un booleano que está en `true` mientras esperamos la respuesta de Groq. Mientras está activo, se muestra "Pensando…" en el `MessageList` y se deshabilita el input para que no puedas mandar otro mensaje hasta que termine.

### error
Guarda un texto descriptivo si algo salió mal. Cuando no es `null`, se muestra una tarjeta roja en la interfaz. Se limpia automáticamente al empezar un nuevo envío.

---

## 3. La llamada a la API — fetch

### Cabeceras

```typescript
const res = await fetch(GROQ_ENDPOINT, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
})
```

**Explicación:** `Authorization: Bearer <clave>` es el mecanismo estándar de autenticación de APIs REST. La clave se lee de `process.env.NEXT_PUBLIC_GROQ_API_KEY`, que está definida en `.env.local`. El prefijo `NEXT_PUBLIC_` es necesario para que Next.js exponga la variable al navegador. `Content-Type: application/json` le dice al servidor que el cuerpo va en formato JSON.

### Por qué se envía el historial completo

```typescript
const body = {
  model: "qwen/qwen3.8-27b",
  messages: updatedMessages.map((m) => ({
    role: m.role,
    content: m.content,
  })),
  temperature: 0.6,
  max_completion_tokens: 800,
  top_p: 0.95,
  reasoning_effort: "none",
  stream: false,
  stop: null,
}
```

**Explicación:** La API de Groq (y la mayoría de APIs de chat) es **stateless**: no recuerda la conversación entre llamadas. Si solo enviaras el último mensaje, el modelo no sabría de qué se viene hablando. Por eso le mandamos `updatedMessages` completo (mapeado al formato `{ role, content }` que espera la API). Cada llamada incluye todo el historial para que el modelo tenga contexto completo.

Los parámetros del modelo:
- `model`: el modelo a usar (`qwen/qwen3.8-27b`).
- `temperature`: controla qué tan "creativa" es la respuesta (0 = siempre la misma, 1 = más variada). 0.6 es un punto medio.
- `max_completion_tokens`: límite de tokens que puede generar la respuesta. Se bajó a 800 para respetar el límite de 1000 tokens/minuto del plan gratuito de Groq.
- `stream: false`: en lugar de recibir la respuesta en partes (streaming), esperamos a tenerla completa de una vez. Es más simple de manejar.
- `reasoning_effort: "none"`: desactiva el razonamiento paso a paso para respuestas más rápidas.

### Cómo se lee la respuesta

```typescript
const data = await res.json()
const elapsedMs = Math.round(performance.now() - t0)
const replyContent = data.choices?.[0]?.message?.content ?? ""
const usage = data.usage ?? {}

const promptTokens = usage.prompt_tokens ?? 0
const completionTokens = usage.completion_tokens ?? 0
const totalTokens = usage.total_tokens ?? 0
```

**Explicación:** `data.choices[0].message.content` es el texto que generó el modelo. Los `?.` (optional chaining) evitan que la app se rompa si la respuesta tiene una estructura inesperada. El `?? ""` (nullish coalescing) da un string vacío como fallback. `elapsedMs` se calcula restando el timestamp que guardamos al inicio (`performance.now()`), lo que nos da cuánto milisegundos tardó la API en responder.

---

## 4. Manejo de errores

```typescript
if (!res.ok) {
  let detail = `Error ${res.status}`
  try {
    const errBody = await res.json()
    if (errBody.error?.message) detail += `: ${errBody.error.message}`
  } catch {
    /* ignorar */
  }
  throw new Error(detail)
}
```

Después del fetch, primero chequeamos `res.ok` (que es `false` para cualquier código HTTP que no sea 2xx — 429, 500, 401, etc.). Si falla, intentamos leer el cuerpo del error, porque Groq suele devolver un JSON con `error.message` que explica el problema (ej: "rate limit exceeded", "invalid API key"). Si no se puede parsear el JSON, mostramos solo el código de estado.

### El catch general:

```typescript
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : "Error inesperado al conectar con Groq"
  setError(message)
} finally {
  setIsLoading(false)
}
```

**Explicación:** El `catch` atrapa cualquier error: tanto el que lanzamos manualmente arriba (`throw new Error(...)`) como errores de red (si el usuario está offline, si la API no responde, etc.). Se guarda el mensaje en el estado `error`, que el componente `MessageList` muestra como una tarjeta roja. El bloque `finally` garantiza que `isLoading` se desactive siempre, incluso si hubo error, para que la UI no se quede eternamente "Pensando…".

**Casos cubiertos:**
- Error 401 (API key inválida)
- Error 429 (límite de tokens excedido)
- Error 500 (error interno de Groq)
- Error de red (usuario sin internet)
- API key no configurada (se chequea antes del fetch)

---

## 5. Persistencia con localStorage

### Cargar al montar (useEffect sin dependencias)

```typescript
useEffect(() => {
  const savedMessages = loadFromStorage<ChatMessage[]>(STORAGE_KEY_MESSAGES, [])
  const savedStats = loadFromStorage<UsageStats>(STORAGE_KEY_STATS, emptyStats)
  if (savedMessages.length > 0) {
    setMessages(savedMessages)
    setUsageStats(savedStats)
  }
}, [])
```

**Explicación:** Este `useEffect` se ejecuta solo una vez cuando el componente se monta (el array vacío `[]` al final significa "sin dependencias"). Su trabajo es leer datos previos de `localStorage`. La función `loadFromStorage` devuelve el valor parseado o el fallback si no existe o no se puede parsear. La condición `if (savedMessages.length > 0)` evita sobrescribir el estado inicial vacío si no hay datos guardados, para no disparar renders innecesarios.

Solo se cargan mensajes si `savedMessages.length > 0`, y en ese caso también se cargan las stats. Esto asegura consistencia: si hay mensajes, también deben haber stats.

### Guardar en cada cambio

```typescript
useEffect(() => {
  saveToStorage(STORAGE_KEY_MESSAGES, messages)
}, [messages])

useEffect(() => {
  saveToStorage(STORAGE_KEY_STATS, usageStats)
}, [usageStats])
```

**Explicación:** Cada vez que cambia `messages` o `usageStats`, se guarda automáticamente en `localStorage`. Están separados en dos `useEffect` en lugar de uno solo porque son dos claves distintas en `localStorage` y se actualizan de forma independiente. Esto asegura que:

- Si solo cambian los mensajes, no se re-escribe las stats innecesariamente.
- Si recargás la página, todo vuelve exactamente como estaba.

### Borrar conversación

```typescript
const handleClear = useCallback(() => {
  setMessages([])
  setUsageStats(emptyStats)
  setError(null)
  localStorage.removeItem(STORAGE_KEY_MESSAGES)
  localStorage.removeItem(STORAGE_KEY_STATS)
}, [])
```

**Explicación:** Reinicia todos los estados en memoria y también elimina las claves de `localStorage`. Sin el `localStorage.removeItem`, al recargar la página aparecerían los datos viejos aunque los hubieras "borrado".

---

## 6. Acumulación de tokens

```typescript
setUsageStats((prev) => {
  const newTps = elapsedMs > 0
    ? Math.round((completionTokens / elapsedMs) * 1000)
    : 0
  return {
    promptTokens: prev.promptTokens + promptTokens,
    completionTokens: prev.completionTokens + completionTokens,
    totalTokens: prev.totalTokens + totalTokens,
    exchanges: prev.exchanges + 1,
    lastElapsedMs: elapsedMs,
    lastTokensPerSecond: newTps,
    peakTokensPerSecond: Math.max(prev.peakTokensPerSecond, newTps),
  }
})
```

**Explicación:** Cada respuesta de Groq incluye un objeto `usage` con los tokens de esa llamada específica. No podemos simplemente reemplazar las stats porque perderíamos el acumulado de toda la sesión.

Usamos la forma funcional de `setUsageStats` — `(prev) => {...}` — que recibe el estado anterior y devuelve el nuevo. Así:

- `promptTokens`, `completionTokens`, `totalTokens`: se **suman** a lo que ya había (`prev.promptTokens + promptTokens`).
- `exchanges`: aumenta en 1 cada vez que el asistente responde.
- `lastElapsedMs` y `lastTokensPerSecond`: se reemplazan con los valores de la última respuesta (para mostrar "el último tardó X").
- `peakTokensPerSecond`: usa `Math.max()` para conservar el valor más alto de velocidad que se haya alcanzado.

### La velocidad se calcula así:

```typescript
tokensPerSecond: elapsedMs > 0
  ? Math.round((completionTokens / elapsedMs) * 1000)
  : 0
```

Se divide la cantidad de tokens generados (`completionTokens`) por los milisegundos que tardó y se multiplica por 1000 para convertir a segundos. El `elapsedMs > 0` evita una división por cero.