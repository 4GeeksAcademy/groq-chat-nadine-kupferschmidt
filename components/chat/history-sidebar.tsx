import { chatHistory } from "@/lib/sample-data"
import { Button } from "@/components/ui/button"

export function HistorySidebar() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 pb-3 pt-4">
        <h2 className="font-display text-sm font-700 tracking-tight text-foreground">
          Tus chats
        </h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-600 text-secondary-foreground tabular">
          {chatHistory.reduce((n, g) => n + g.items.length, 0)}
        </span>
      </div>

      <div className="px-4">
        <Button
          type="button"
          className="w-full justify-start gap-2 rounded-xl bg-primary font-600 text-primary-foreground shadow-soft hover:bg-primary/90"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nuevo chat
        </Button>
      </div>

      <nav className="mt-4 min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {chatHistory.map((group) => (
          <div key={group.group}>
            <p className="px-1 pb-1.5 text-[11px] font-600 uppercase tracking-[0.14em] text-muted-foreground">
              {group.group}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={item.active ? "true" : undefined}
                    className={
                      "group flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors " +
                      (item.active
                        ? "bg-card shadow-soft ring-1 ring-primary/30"
                        : "hover:bg-card/70")
                    }
                  >
                    <span className="flex items-center gap-2">
                      {item.active && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                      <span className="truncate text-[13px] font-600 text-foreground">
                        {item.title}
                      </span>
                      <span className="ml-auto shrink-0 text-[10px] font-500 text-muted-foreground tabular">
                        {item.time}
                      </span>
                    </span>
                    <span className="truncate text-[12px] font-500 text-muted-foreground">
                      {item.preview}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}
