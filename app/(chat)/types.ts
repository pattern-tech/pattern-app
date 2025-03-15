export interface Conversation {
  id: string;
  name: string;
  project_id: string;
}

export interface Message {
  role: 'human' | 'ai';
  content: string;
}

export type ApiGetConversationResponse = Conversation | null;
export type ApiGetConversationMessagesResponse = Message[];
export type ApiCreateConversationResponse = Conversation;
export type ApiSendMessageResponse = string;
export type ApiSendMessageStreamedResponse = ReadableStream;
