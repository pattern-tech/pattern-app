export interface Conversation {
  id: string;
  name: string;
  project_id: string;
  user_id: string;
  updated_at: string;
}

export interface Message {
  role: 'human' | 'ai';
  content: string;
}

export interface QueryUsage {
  todayQueryCount: number;
  remainingQueriesToday: number;
  maxQueryAllowancePerDay: number;
  nextResetTime: string;
}

export type ApiGetConversationResponse = Conversation | null;
export type ApiGetConversationMessagesResponse = Message[];
export type ApiCreateConversationResponse = Conversation;
export type ApiSendMessageResponse = string;
export type ApiSendMessageStreamedResponse = ReadableStream;
export type ApiGetAllConversationsResponse = Conversation[];
export interface ApiRenameConversationResponse {
  title: string;
}
export interface ApiQueryUsageResponse {
  today_query_count: number;
  remaining_queries_today: number;
  max_query_allowance_per_day: number;
  next_reset_time: string;
}
