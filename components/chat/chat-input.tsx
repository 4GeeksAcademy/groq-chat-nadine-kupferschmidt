import { Button } from "@/components/ui/button"

export function ChatInput() {
  return (
    <div className="border-t border-border bg-background/80 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex items-end gap-2 rounded-3xl border border-border bg-card p-2 pl-4 shadow-soft focus-within:ring-2 focus-within:ring-ring/50">
        <textarea
          rows={1}
          placeholder="Escribe un mensaje para la máquina…"
          className="max-h-32 flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="Mensaje"
        />
        <Button
          type="button"
          size="icon"
          className="size-10 shrink-0 rounded-2xl shadow-soft"
          aria-label="Enviar mensaje"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Button>
      </div>
      <p className="px-2 pt-2 text-center text-[11px] text-muted-foreground">
        Prototipo visual · el envío está deshabilitado
      </p>
    </div>
  )
}
