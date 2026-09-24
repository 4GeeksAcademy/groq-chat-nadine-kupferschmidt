import { usageStats, extraMetrics } from "@/lib/sample-data"

function TokenBar({ value, total, tone }: { value: number; total: number; tone: "prompt" | "completion" }) {
  const pct = Math.round((value / total) * 100)
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={tone === "prompt" ? "h-full rounded-full bg-primary/50" : "h-full rounded-full bg-primary"}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function StatsSidebar() {
  const { promptTokens, completionTokens, totalTokens } = usageStats

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
        <p className="text-xs text-muted-foreground">tokens en 6 mensajes</p>
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
        {extraMetrics.map((m) => (
          <div key={m.label} className="rounded-2xl bg-card p-3 shadow-soft">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{m.label}</p>
            <p className="tabular font-display text-lg font-semibold leading-tight text-foreground">{m.value}</p>
            <p className="text-[11px] text-muted-foreground">{m.hint}</p>
          </div>
        ))}
      </div>

      <p className="mt-auto text-pretty text-[11px] leading-relaxed text-muted-foreground">
        Datos de ejemplo estáticos. Conecta tu propia lógica para mostrar el consumo real.
      </p>
    </div>
  )
}
