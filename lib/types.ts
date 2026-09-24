export type Role = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: Role
  content: string
  /** per-response metrics, only present on assistant messages once complete */
  meta?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
    elapsedMs: number
    tokensPerSecond: number
  }
}

export type UsageStats = {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  exchanges: number
  lastElapsedMs: number
  lastTokensPerSecond: number
  peakTokensPerSecond: number
}

export const emptyStats: UsageStats = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
  exchanges: 0,
  lastElapsedMs: 0,
  lastTokensPerSecond: 0,
  peakTokensPerSecond: 0,
}
