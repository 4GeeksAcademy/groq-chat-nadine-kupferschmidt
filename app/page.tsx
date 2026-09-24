"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { BrandMark } from "@/components/chat/brand-mark"
import { HistorySidebar } from "@/components/chat/history-sidebar"
import { StatsSidebar } from "@/components/chat/stats-sidebar"
import { MessageList } from "@/components/chat/message-list"
import { ChatInput } from "@/components/chat/chat-input"
import { Button } from "@/components/ui/button"
import type { ChatMessage, UsageStats } from "@/lib/types"
import { emptyStats } from "@/lib/types"

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

const STORAGE_KEY_MESSAGES = "groqchat_messages"
const STORAGE_KEY_STATS = "groqchat_stats"

function generateId() {
  return crypto.randomUUID()
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota exceeded — ignorar */
  }
}

export default function Page() {
  const [statsOpen, setStatsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [usageStats, setUsageStats] = useState<UsageStats>(emptyStats)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const messagesRef = useRef(messages)
  messagesRef.current = messages

  // Cargar desde localStorage al montar
  useEffect(() => {
    const savedMessages = loadFromStorage<ChatMessage[]>(STORAGE_KEY_MESSAGES, [])
    const savedStats = loadFromStorage<UsageStats>(STORAGE_KEY_STATS, emptyStats)
    if (savedMessages.length > 0) {
      setMessages(savedMessages)
      setUsageStats(savedStats)
    }
  }, [])

  // Persistir en localStorage cuando cambien
  useEffect(() => {
    saveToStorage(STORAGE_KEY_MESSAGES, messages)
  }, [messages])

  useEffect(() => {
    saveToStorage(STORAGE_KEY_STATS, usageStats)
  }, [usageStats])

  const handleClear = useCallback(() => {
    setMessages([])
    setUsageStats(emptyStats)
    setError(null)
    localStorage.removeItem(STORAGE_KEY_MESSAGES)
    localStorage.removeItem(STORAGE_KEY_STATS)
  }, [])

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

    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY
      if (!apiKey) {
        throw new Error("La clave de API de Groq no está configurada (NEXT_PUBLIC_GROQ_API_KEY)")
      }

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

      const res = await fetch(GROQ_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

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

      const data = await res.json()
      const elapsedMs = Math.round(performance.now() - t0)
      const replyContent = data.choices?.[0]?.message?.content ?? ""
      const usage = data.usage ?? {}

      const promptTokens = usage.prompt_tokens ?? 0
      const completionTokens = usage.completion_tokens ?? 0
      const totalTokens = usage.total_tokens ?? 0

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: replyContent,
        meta: {
          promptTokens,
          completionTokens,
          totalTokens,
          elapsedMs,
          tokensPerSecond: elapsedMs > 0
            ? Math.round((completionTokens / elapsedMs) * 1000)
            : 0,
        },
      }

      setMessages((prev) => [...prev, assistantMessage])
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error inesperado al conectar con Groq"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-background">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            onClick={() => setHistoryOpen((v) => !v)}
            aria-expanded={historyOpen}
            aria-controls="history-panel"
            aria-label={historyOpen ? "Ocultar historial de chats" : "Mostrar historial de chats"}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2.5" />
              <path d="M9 4v16" />
              <path d="M5.5 8.5h1.5M5.5 12h1.5" />
            </svg>
          </Button>
          <BrandMark />
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
            aria-label="Borrar la conversación"
            onClick={handleClear}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
            <span className="hidden sm:inline">Borrar</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl lg:hidden"
            onClick={() => setStatsOpen((v) => !v)}
            aria-expanded={statsOpen}
            aria-controls="stats-panel"
          >
            {statsOpen ? "Ocultar" : "Consumo"}
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={
            "hidden shrink-0 border-r border-border bg-sidebar transition-all duration-300 lg:block " +
            (historyOpen ? "w-80" : "w-0 overflow-hidden border-r-0")
          }
        >
          <div className="h-full w-80">
            <HistorySidebar messages={messages} />
          </div>
        </aside>

        <section className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl">
              <MessageList messages={messages} isLoading={isLoading} error={error} />
            </div>
          </div>
          <div className="mx-auto w-full max-w-3xl">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </section>

        <aside className="hidden w-80 shrink-0 border-l border-border bg-sidebar lg:block">
          <StatsSidebar stats={usageStats} messages={messages} isLoading={isLoading} />
        </aside>
      </div>

      {historyOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            aria-label="Cerrar historial de chats"
            onClick={() => setHistoryOpen(false)}
          />
          <div
            id="history-panel"
            className="absolute left-0 top-0 h-full w-[85%] max-w-xs border-r border-border bg-sidebar shadow-soft-lg"
          >
            <HistorySidebar messages={messages} />
          </div>
        </div>
      )}

      {statsOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            aria-label="Cerrar panel de consumo"
            onClick={() => setStatsOpen(false)}
          />
          <div
            id="stats-panel"
            className="absolute right-0 top-0 h-full w-[85%] max-w-xs border-l border-border bg-sidebar shadow-soft-lg"
          >
            <StatsSidebar stats={usageStats} messages={messages} isLoading={isLoading} />
          </div>
        </div>
      )}
    </main>
  )
}
