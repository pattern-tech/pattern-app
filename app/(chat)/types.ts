export interface Conversation {
  id: string;
  name: string;
  project_id: string;
}

export type ApiGetConversationResponse = Conversation | null;
export type ApiCreateConversationResponse = Conversation;
export type ApiSendMessageResponse = string;
export type ApiSendMessageStreamedResponse = ReadableStream;
