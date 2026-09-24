import { sampleMessages } from "@/lib/sample-data"
import { cn } from "@/lib/utils"

export function MessageList() {
  return (
    <div className="flex flex-col gap-5 px-4 py-6 sm:px-6">
      {sampleMessages.map((message) => {
        const isUser = message.role === "user"
        return (
          <div
            key={message.id}
            className={cn("flex w-full flex-col gap-1.5", isUser ? "items-end" : "items-start")}
          >
            <div className="flex items-center gap-2 px-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {isUser ? "Tú" : "GroqChat"}
              </span>
              <span className="tabular text-[11px] text-muted-foreground/70">{message.time}</span>
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
    </div>
  )
}
