export interface TokenEvent {
  type: 'token';
  data: string;
}

export interface ToolStartEvent {
  type: 'tool_start';
  tool: string;
  tool_input: Record<string, string>;
}

export interface CompletionEvent {
  type: 'completion';
  data: 'Stream completed';
}

export type PatternStreamingResponseEvent =
  | TokenEvent
  | ToolStartEvent
  | CompletionEvent;

export interface PatternProviderMetadata {
  accessToken: string;
  conversationId: string;
  projectId: string;
}
