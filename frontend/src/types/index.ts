export type AgentName = 'COO' | 'Research Agent' | 'Content Agent' | 'QA Agent'

export type AgentStatus =
  | 'IDLE'
  | 'WORKING'
  | 'WAITING'
  | 'COMPLETE'
  | 'ERROR'

export type WsMessageType =
  | 'agent_status_update'
  | 'agent_message'
  | 'agent_thinking'
  | 'task_complete'
  | 'error'
  | 'snapshot'

export type AgentStatusUpdate = {
  type: 'agent_status_update'
  agent: AgentName
  status: AgentStatus
  details: string
  timestamp: string
}

export type AgentMessage = {
  type: 'agent_message'
  from: AgentName
  to: AgentName
  message: string
  timestamp: string
}

export type AgentThinking = {
  type: 'agent_thinking'
  agent: AgentName
  thinking: string
  timestamp: string
}

export type TaskComplete = {
  type: 'task_complete'
  deliverable: string
  timestamp: string
}

export type ErrorMessage = {
  type: 'error'
  message: string
  timestamp: string
}

export type SnapshotMessage = {
  type: 'snapshot'
  agents: Record<string, { status: AgentStatus; details: string; updated_at: string }>
  messages: Array<{
    from_agent: string
    to_agent: string
    body: string
    created_at: string
  }>
  thinking_log: Array<{ agent: string; text: string; created_at: string }>
  deliverable: string | null
  terminal: boolean
}

export type WsMessage =
  | AgentStatusUpdate
  | AgentMessage
  | AgentThinking
  | TaskComplete
  | ErrorMessage
  | SnapshotMessage

export function parseWsMessage(data: unknown): WsMessage | null {
  if (!data || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  const t = o.type
  if (t === 'agent_status_update' && typeof o.agent === 'string') {
    return {
      type: 'agent_status_update',
      agent: o.agent as AgentName,
      status: o.status as AgentStatus,
      details: String(o.details ?? ''),
      timestamp: String(o.timestamp ?? ''),
    }
  }
  if (t === 'agent_message') {
    return {
      type: 'agent_message',
      from: o.from as AgentName,
      to: o.to as AgentName,
      message: String(o.message ?? ''),
      timestamp: String(o.timestamp ?? ''),
    }
  }
  if (t === 'agent_thinking') {
    return {
      type: 'agent_thinking',
      agent: o.agent as AgentName,
      thinking: String(o.thinking ?? ''),
      timestamp: String(o.timestamp ?? ''),
    }
  }
  if (t === 'task_complete') {
    return {
      type: 'task_complete',
      deliverable: String(o.deliverable ?? ''),
      timestamp: String(o.timestamp ?? ''),
    }
  }
  if (t === 'error') {
    return {
      type: 'error',
      message: String(o.message ?? 'Unknown error'),
      timestamp: String(o.timestamp ?? ''),
    }
  }
  if (t === 'snapshot') {
    return o as SnapshotMessage
  }
  return null
}
