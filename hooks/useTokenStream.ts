import { useEffect, useRef, useState } from 'react'

export interface TokenEvent {
  source: string
  mint: string
  name: string
  symbol: string
  twitter: string
  creator: string
  uri: string
  solAmountFloat: number
  average_mcap: number
  migrationPerc: number
  isMigrated: boolean
  isATH: boolean
  isCommunity: boolean
  time: string
}

export function useTokenStream(limit = 10000) {
  const [tokens, setTokens] = useState<TokenEvent[]>([])
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/ws')
    ws.current = socket

    socket.onmessage = (msg) => {
      try {
        const data: TokenEvent = JSON.parse(msg.data)
        setTokens(prev => {
          const filtered = prev.filter(t => t.mint !== data.mint)
          return [data, ...filtered].slice(0, limit)
        })
      } catch (err) {
        console.error('Ошибка парсинга WebSocket:', err)
      }
    }

    socket.onerror = (e) => console.error('WebSocket error:', e)
    socket.onclose = () => console.warn('WebSocket closed')

    return () => {
      socket.close()
    }
  }, [])

  return tokens
}
