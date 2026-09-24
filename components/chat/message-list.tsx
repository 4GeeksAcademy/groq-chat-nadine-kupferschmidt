import type { ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"

export function MessageList({
  messages,
  isLoading,
  error,
}: {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
}) {
  return (
    <div className="flex flex-col gap-5 px-4 py-6 sm:px-6">
      {messages.length === 0 && !isLoading && !error && (
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-center text-sm text-muted-foreground">
            Envía un mensaje para empezar la conversación.
          </p>
        </div>
      )}

      {messages.map((message) => {
        const isUser = message.role === "user"
        const time = message.meta?.elapsedMs
          ? `${(message.meta.elapsedMs / 1000).toFixed(1)}s`
          : undefined
        return (
          <div
            key={message.id}
            className={cn("flex w-full flex-col gap-1.5", isUser ? "items-end" : "items-start")}
          >
            <div className="flex items-center gap-2 px-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {isUser ? "Tú" : "GroqChat"}
              </span>
              {time && (
                <span className="tabular text-[11px] text-muted-foreground/70">{time}</span>
              )}
            </div>
            <div
              className={cn(
                "max-w-[85%] text-pretty rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-soft sm:max-w-[75%]",
                isUser
                  ? "rounded-br-lg bg-primary text-primary-foreground"
                  : "rounded-bl-lg bg-card text-card-foreground",
              )}
            >
              {message.content}
            </div>
          </div>
        )
      })}

      {isLoading && (
        <div className="flex w-full flex-col gap-1.5 items-start">
          <div className="flex items-center gap-2 px-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              GroqChat
            </span>
          </div>
          <div className="max-w-[85%] rounded-3xl rounded-bl-lg bg-card px-4 py-3 text-sm leading-relaxed shadow-soft sm:max-w-[75%]">
            <span className="text-muted-foreground">Pensando…</span>
            <span className="inline-flex gap-0.5 ml-1">
              <span className="animate-bounce [animation-delay:0ms] size-1.5 rounded-full bg-muted-foreground/40" />
              <span className="animate-bounce [animation-delay:150ms] size-1.5 rounded-full bg-muted-foreground/40" />
              <span className="animate-bounce [animation-delay:300ms] size-1.5 rounded-full bg-muted-foreground/40" />
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex w-full flex-col gap-1.5 items-start">
          <div className="max-w-[85%] rounded-3xl rounded-bl-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm leading-relaxed shadow-soft sm:max-w-[75%]">
            <span className="font-medium text-destructive">Error</span>
            <p className="text-destructive/80 mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
