import { useEffect, useRef } from 'react'

import { wsUrlForTask } from '@/lib/env'
import { type WsMessage, parseWsMessage } from '@/types'

export function useWebSocket(
  taskId: string | null,
  enabled: boolean,
  onMessage: (message: WsMessage) => void,
) {
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    if (!taskId || !enabled) return

    let closed = false
    const url = wsUrlForTask(taskId)
    const ws = new WebSocket(url)

    ws.onmessage = (event) => {
      try {
        const raw = JSON.parse(String(event.data)) as unknown
        const msg = parseWsMessage(raw)
        if (msg) onMessageRef.current(msg)
      } catch {
        /* ignore malformed frames */
      }
    }

    ws.onerror = () => {
      onMessageRef.current({
        type: 'error',
        message: 'WebSocket connection error',
        timestamp: new Date().toISOString(),
      })
    }

    return () => {
      closed = true
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close()
      }
      void closed
    }
  }, [taskId, enabled])
}
