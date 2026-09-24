"use client"

import { useState } from "react"
import { BrandMark } from "@/components/chat/brand-mark"
import { HistorySidebar } from "@/components/chat/history-sidebar"
import { StatsSidebar } from "@/components/chat/stats-sidebar"
import { MessageList } from "@/components/chat/message-list"
import { ChatInput } from "@/components/chat/chat-input"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [statsOpen, setStatsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

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
            <HistorySidebar />
          </div>
        </aside>

        <section className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl">
              <MessageList />
            </div>
          </div>
          <div className="mx-auto w-full max-w-3xl">
            <ChatInput />
          </div>
        </section>

        <aside className="hidden w-80 shrink-0 border-l border-border bg-sidebar lg:block">
          <StatsSidebar />
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
            <HistorySidebar />
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
            <StatsSidebar />
          </div>
        </div>
      )}
    </main>
  )
}
