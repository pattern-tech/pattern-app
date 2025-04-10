export interface TokenEvent {
  type: 'token';
  data: string;
}

export interface ToolStartEvent {
  type: 'tool_start';
  tool_name: string;
  params: string;
  timestamp: string;
}

export interface ToolEndEvent {
  type: 'tool_end';
  tool_name: string;
  output: any;
  timestamp: string;
}

export interface HeartbeatEvent {
  type: 'heartbeat';
  data: 'processing_started' | 'still_processing';
}

export interface AgentStartEvent {
  type: 'agent_start';
  timestamp: string;
}

export interface AgentFinishEvent {
  type: 'agent_finish';
  timestamp: string;
}

export interface ToolSelectionStartEvent {
  type: 'tool_selection_start';
  timestamp: string;
}

export interface ToolSelectionEndEvent {
  type: 'tool_selection_end';
  selected_tools: string[];
  timestamp: string;
}

export type PatternStreamingResponseEvent =
  | TokenEvent
  | ToolStartEvent
  | ToolEndEvent
  | HeartbeatEvent
  | AgentStartEvent
  | AgentFinishEvent
  | ToolSelectionStartEvent
  | ToolSelectionEndEvent;

export interface PatternProviderMetadata {
  accessToken: string;
  conversationId: string;
  projectId: string;
}
