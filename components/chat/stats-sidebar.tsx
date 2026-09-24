import type { ChatMessage, UsageStats } from "@/lib/types"

function TokenBar({ value, total, tone }: { value: number; total: number; tone: "prompt" | "completion" }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={tone === "prompt" ? "h-full rounded-full bg-primary/50" : "h-full rounded-full bg-primary"}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function StatsSidebar({
  stats,
  messages,
  isLoading,
}: {
  stats: UsageStats
  messages: ChatMessage[]
  isLoading: boolean
}) {
  const { promptTokens, completionTokens, totalTokens, exchanges, lastElapsedMs, lastTokensPerSecond, peakTokensPerSecond } = stats

  const userCount = messages.filter((m) => m.role === "user").length
  const assistantCount = messages.filter((m) => m.role === "assistant").length
  const totalMessages = messages.length

  const lastTime = lastElapsedMs > 0 ? `${(lastElapsedMs / 1000).toFixed(2)} s` : "—"
  const lastTps = lastTokensPerSecond > 0 ? `${lastTokensPerSecond.toLocaleString("es-ES")} t/s` : "—"
  const peakTps = peakTokensPerSecond > 0 ? `${peakTokensPerSecond.toLocaleString("es-ES")} t/s` : "—"

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
      <div>
        <p className="font-display text-sm font-semibold text-foreground">Consumo</p>
        <p className="text-xs text-muted-foreground">Estadísticas de la sesión actual</p>
      </div>

      <div className="rounded-2xl bg-card p-4 shadow-soft">
        <div className="flex items-end justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total acumulado</span>
        </div>
        <p className="tabular font-display text-3xl font-semibold text-foreground">
          {totalTokens.toLocaleString("es-ES")}
        </p>
        <p className="text-xs text-muted-foreground">
          tokens en {totalMessages} {totalMessages === 1 ? "mensaje" : "mensajes"}
        </p>
      </div>

      <div className="space-y-4 rounded-2xl bg-card p-4 shadow-soft">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-foreground">Tokens de prompt</span>
            <span className="tabular text-sm font-semibold text-foreground">
              {promptTokens.toLocaleString("es-ES")}
            </span>
          </div>
          <TokenBar value={promptTokens} total={totalTokens} tone="prompt" />
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-foreground">Tokens de completado</span>
            <span className="tabular text-sm font-semibold text-foreground">
              {completionTokens.toLocaleString("es-ES")}
            </span>
          </div>
          <TokenBar value={completionTokens} total={totalTokens} tone="completion" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card p-3 shadow-soft">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Tiempo de respuesta</p>
          <p className="tabular font-display text-lg font-semibold leading-tight text-foreground">{lastTime}</p>
          <p className="text-[11px] text-muted-foreground">última generación</p>
        </div>
        <div className="rounded-2xl bg-card p-3 shadow-soft">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Tokens por segundo</p>
          <p className="tabular font-display text-lg font-semibold leading-tight text-foreground">{lastTps}</p>
          <p className="text-[11px] text-muted-foreground">velocidad máxima: {peakTps}</p>
        </div>
        <div className="rounded-2xl bg-card p-3 shadow-soft">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Mensajes en sesión</p>
          <p className="tabular font-display text-lg font-semibold leading-tight text-foreground">{totalMessages}</p>
          <p className="text-[11px] text-muted-foreground">{userCount} tuyos · {assistantCount} del agente</p>
        </div>
        <div className="rounded-2xl bg-card p-3 shadow-soft">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Intercambios</p>
          <p className="tabular font-display text-lg font-semibold leading-tight text-foreground">{exchanges}</p>
          <p className="text-[11px] text-muted-foreground">usuario → asistente</p>
        </div>
      </div>

      {isLoading && (
        <p className="text-pretty text-[11px] leading-relaxed text-muted-foreground animate-pulse">
          Procesando solicitud…
        </p>
      )}
    </div>
  )
}
