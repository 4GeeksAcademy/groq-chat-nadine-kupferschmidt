import type { ChatMessage } from "@/lib/types"

function conversationTitle(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === "user")
  if (!first) return "Nueva conversación"
  const MAX = 35
  const text = first.content.trim()
  if (text.length <= MAX) return text
  return text.slice(0, MAX).trimEnd() + "…"
}

export function HistorySidebar({ messages }: { messages: ChatMessage[] }) {
  const title = conversationTitle(messages)
  const messageCount = messages.length
  const chatCount = messageCount > 0 ? 1 : 0

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 pb-3 pt-4">
        <h2 className="font-display text-sm font-700 tracking-tight text-foreground">
          Tus chats
        </h2>
        {chatCount > 0 && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-600 text-secondary-foreground tabular">
            {chatCount}
          </span>
        )}
      </div>

      <nav className="mt-4 min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {messageCount > 0 ? (
          <div>
            <p className="px-1 pb-1.5 text-[11px] font-600 uppercase tracking-[0.14em] text-muted-foreground">
              Actual
            </p>
            <ul className="space-y-1">
              <li>
                <button
                  type="button"
                  aria-current="true"
                  className="group flex w-full flex-col gap-0.5 rounded-xl bg-card px-3 py-2.5 text-left shadow-soft ring-1 ring-primary/30 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="truncate text-[13px] font-600 text-foreground">
                      {title}
                    </span>
                    <span className="ml-auto shrink-0 text-[10px] font-500 text-muted-foreground tabular">
                      {messageCount} msj.
                    </span>
                  </span>
                  <span className="truncate text-[12px] font-500 text-muted-foreground">
                    {messageCount === 1 ? "Esperando respuesta…" : "Conversación activa"}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Todavía no hay mensajes.
          </p>
        )}
      </nav>
    </div>
  )
}
