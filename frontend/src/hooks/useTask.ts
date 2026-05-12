import { useCallback, useEffect, useRef, useState } from 'react'

import { useWebSocket } from '@/hooks/useWebSocket'
import { createTask } from '@/services/api'
import type {
  AgentName,
  AgentStatus,
  SnapshotMessage,
  WsMessage,
} from '@/types'

const NAMES: AgentName[] = ['COO', 'Research Agent', 'Content Agent', 'QA Agent']

export type AgentRow = {
  status: AgentStatus
  details: string
  updatedAt: string
}

function emptyAgents(): Record<AgentName, AgentRow> {
  const now = new Date().toISOString()
  return {
    COO: { status: 'IDLE', details: '', updatedAt: now },
    'Research Agent': { status: 'IDLE', details: '', updatedAt: now },
    'Content Agent': { status: 'IDLE', details: '', updatedAt: now },
    'QA Agent': { status: 'IDLE', details: '', updatedAt: now },
  }
}

function isAgentName(s: string): s is AgentName {
  return (NAMES as string[]).includes(s)
}

function applySnapshot(msg: SnapshotMessage) {
  const agents = emptyAgents()
  for (const [key, row] of Object.entries(msg.agents)) {
    if (!isAgentName(key)) continue
    agents[key] = {
      status: row.status as AgentStatus,
      details: row.details,
      updatedAt: row.updated_at,
    }
  }
  const messages = msg.messages.map((m) => ({
    from: m.from_agent,
    to: m.to_agent,
    body: m.body,
    ts: m.created_at,
  }))
  const thinking = msg.thinking_log.map((t) => ({
    agent: t.agent,
    text: t.text,
    ts: t.created_at,
  }))
  return { agents, messages, thinking, deliverable: msg.deliverable }
}

export function useTask(onComplete?: (description: string) => void) {
  const onCompleteRef = useRef(onComplete)
  const lastDescriptionRef = useRef('')

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])
  const [taskId, setTaskId] = useState<string | null>(null)
  const [connectWs, setConnectWs] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [agents, setAgents] = useState<Record<AgentName, AgentRow>>(() => emptyAgents())
  const [messages, setMessages] = useState<Array<{ from: string; to: string; body: string; ts: string }>>([])
  const [thinking, setThinking] = useState<Array<{ agent: string; text: string; ts: string }>>([])
  const [deliverable, setDeliverable] = useState<string | null>(null)

  const clearRun = useCallback(() => {
    setTaskId(null)
    setConnectWs(false)
    setGlobalError(null)
    setAgents(emptyAgents())
    setMessages([])
    setThinking([])
    setDeliverable(null)
  }, [])

  const handleMessage = useCallback(
    (msg: WsMessage) => {
      if (msg.type === 'snapshot') {
        const snap = applySnapshot(msg)
        setAgents(snap.agents)
        setMessages(snap.messages)
        setThinking(snap.thinking)
        setDeliverable(snap.deliverable)
        if (msg.terminal) {
          setConnectWs(false)
        }
        return
      }
      if (msg.type === 'agent_status_update') {
        setAgents((prev) => ({
          ...prev,
          [msg.agent]: {
            status: msg.status,
            details: msg.details,
            updatedAt: msg.timestamp,
          },
        }))
        return
      }
      if (msg.type === 'agent_message') {
        setMessages((prev) => [
          ...prev,
          { from: msg.from, to: msg.to, body: msg.message, ts: msg.timestamp },
        ])
        return
      }
      if (msg.type === 'agent_thinking') {
        setThinking((prev) => [...prev, { agent: msg.agent, text: msg.thinking, ts: msg.timestamp }])
        return
      }
      if (msg.type === 'task_complete') {
        setDeliverable(msg.deliverable)
        setConnectWs(false)
        onCompleteRef.current?.(lastDescriptionRef.current)
        return
      }
      if (msg.type === 'error') {
        setGlobalError(msg.message)
        setConnectWs(false)
      }
    },
    [],
  )

  useWebSocket(taskId, connectWs && Boolean(taskId), handleMessage)

  const submit = useCallback(
    async (description: string) => {
      const trimmed = description.trim()
      if (!trimmed) {
        setGlobalError('Please enter a task description.')
        return
      }
      clearRun()
      lastDescriptionRef.current = trimmed
      setSubmitting(true)
      setGlobalError(null)
      try {
        const { task_id } = await createTask(trimmed)
        setTaskId(task_id)
        setConnectWs(true)
      } catch (e) {
        setGlobalError(e instanceof Error ? e.message : 'Failed to start task')
      } finally {
        setSubmitting(false)
      }
    },
    [clearRun],
  )

  return {
    taskId,
    submitting,
    connectWs,
    globalError,
    agents,
    messages,
    thinking,
    deliverable,
    submit,
    clearRun,
  }
}
