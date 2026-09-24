// Datos de ejemplo estáticos. Reemplázalos con tu propia lógica y estado.

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  time: string
}

export const sampleMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "Hola, ¿me puedes explicar en pocas palabras qué es un modelo de lenguaje?",
    time: "14:02",
  },
  {
    id: "m2",
    role: "assistant",
    content:
      "Claro. Un modelo de lenguaje es un sistema entrenado con enormes cantidades de texto que aprende a predecir la siguiente palabra más probable. Con eso puede redactar, resumir, traducir y responder preguntas como si mantuviera una conversación.",
    time: "14:02",
  },
  {
    id: "m3",
    role: "user",
    content: "Perfecto. ¿Y por qué a veces se equivoca o inventa datos?",
    time: "14:03",
  },
  {
    id: "m4",
    role: "assistant",
    content:
      "Porque no consulta una base de datos de hechos: genera texto en función de patrones estadísticos. Cuando le falta información fiable, rellena el hueco con lo que le parece plausible. A eso se le llama «alucinación», y por eso conviene verificar los datos importantes.",
    time: "14:03",
  },
  {
    id: "m5",
    role: "user",
    content: "Entendido. Dame un truco rápido para escribir mejores prompts.",
    time: "14:05",
  },
  {
    id: "m6",
    role: "assistant",
    content:
      "Sé específico sobre el formato, el tono y el público. En lugar de «resume esto», prueba «resúmelo en 3 viñetas para un cliente sin conocimientos técnicos». Cuanto más contexto útil le des, mejor será la respuesta.",
    time: "14:05",
  },
]

export type ChatHistoryItem = {
  id: string
  title: string
  preview: string
  time: string
  active?: boolean
}

// Historial de chats de ejemplo (estático). Agrupado por fecha.
export const chatHistory: { group: string; items: ChatHistoryItem[] }[] = [
  {
    group: "Hoy",
    items: [
      {
        id: "c1",
        title: "¿Qué es un modelo de lenguaje?",
        preview: "Claro. Un modelo de lenguaje es un sistema…",
        time: "14:05",
        active: true,
      },
      {
        id: "c2",
        title: "Ideas para nombre de app",
        preview: "Aquí tienes 10 opciones cortas y pegadizas…",
        time: "11:20",
      },
    ],
  },
  {
    group: "Ayer",
    items: [
      {
        id: "c3",
        title: "Resumen de reunión de equipo",
        preview: "Puntos clave: 1) fechas de entrega…",
        time: "18:44",
      },
      {
        id: "c4",
        title: "Corrige este bloque de código",
        preview: "El error viene del índice fuera de rango…",
        time: "09:12",
      },
    ],
  },
  {
    group: "Esta semana",
    items: [
      {
        id: "c5",
        title: "Traducción al inglés técnico",
        preview: "Here is the translation with technical tone…",
        time: "Lun",
      },
      {
        id: "c6",
        title: "Plan de comidas de la semana",
        preview: "Lunes: avena y frutas. Martes: ensalada…",
        time: "Dom",
      },
    ],
  },
]

export type StatMetric = {
  label: string
  value: string
  hint: string
}

// Métricas de consumo de ejemplo (estáticas).
export const usageStats = {
  promptTokens: 1_248,
  completionTokens: 2_607,
  totalTokens: 3_855,
}

export const extraMetrics: StatMetric[] = [
  { label: "Tiempo de respuesta", value: "0.82 s", hint: "última generación" },
  { label: "Tokens por segundo", value: "184 t/s", hint: "velocidad media" },
  { label: "Mensajes en sesión", value: "6", hint: "3 tuyos · 3 del agente" },
  { label: "Modelo", value: "llama-3.3-70b", hint: "vía Groq" },
]
