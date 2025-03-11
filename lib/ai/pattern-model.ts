import type {
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1StreamPart,
} from 'ai';

import { sendMessage, sendMessageStreamed } from '@/app/(chat)/service';
import type {
  PatternProviderMetadata,
  PatternStreamingResponseEvent,
  ToolStartEvent,
} from '@/lib/ai/types';

import { extractErrorMessageOrDefault } from '../utils';

export const patternCoreEndpoint = process.env.PATTERN_CORE_ENDPOINT;
if (!patternCoreEndpoint) {
  throw new Error('PATTERN_CORE_ENDPOINT is not set');
}

const textDecoder = new TextDecoder();

export class PatternModel implements LanguageModelV1 {
  readonly modelId = 'pattern-model';
  readonly provider = 'pattern';
  readonly specificationVersion = 'v1';
  readonly defaultObjectGenerationMode = 'json';

  /**
   * @param options
   * @returns Pattern's metadata
   */
  private extractPatternProviderMetadataFromOptions(
    options: LanguageModelV1CallOptions,
  ) {
    const { providerMetadata } = options;
    if (!providerMetadata?.pattern) {
      throw new Error('Pattern metadata is not provided');
    }

    const patternProviderMetadata =
      providerMetadata.pattern as unknown as PatternProviderMetadata;

    return patternProviderMetadata;
  }

  /**
   * @param options
   * @returns last user text message
   */
  private getLastUserTextMessage(options: LanguageModelV1CallOptions) {
    const lastMessage = options.prompt.at(-1);
    if (lastMessage?.role !== 'user') {
      throw new Error('Last message is not from user');
    }
    const lastMessageContent = lastMessage.content[0];
    if (lastMessageContent.type !== 'text') {
      throw new Error('Last message is not of type text');
    }

    return lastMessageContent.text;
  }

  /**
   * Generate a reasoning text from a tool start event to be shown to user,
   * including tool name and its inputs
   * @param event
   * @returns Reasoning text for a tool start event
   */
  private getToolStartReasoningText(event: ToolStartEvent) {
    return `#### Tool call - ${event.tool}\n${Object.entries(event.tool_input ?? {}).map((entry) => `* **${entry[0]}**: ${entry[1]}\n`)}`;
  }

  /**
   * Get transform stream to be used for transforming Pattern streaming chunks
   * to AI SDK supported chunks
   */
  private getTransformStream() {
    return new TransformStream<string, LanguageModelV1StreamPart>({
      transform: (chunk, controller) => {
        if (ArrayBuffer.isView(chunk)) {
          try {
            const chunkBuffer = new Uint8Array(
              chunk.buffer,
              chunk.byteOffset,
              chunk.byteLength,
            );
            const parsedChunk = textDecoder.decode(chunkBuffer).trim();
            const events = parsedChunk
              .split('\n')
              .map((eventObject) => JSON.parse(eventObject));

            events.forEach((event: PatternStreamingResponseEvent) => {
              if (event.type === 'token') {
                controller.enqueue({
                  type: 'text-delta',
                  textDelta: event.data,
                });
              } else if (event.type === 'tool_start') {
                const text = this.getToolStartReasoningText(event);
                controller.enqueue({
                  type: 'reasoning',
                  textDelta: text,
                });
              } else {
                controller.enqueue({
                  type: 'error',
                  error: `Event type is not supported`,
                });
              }
            });
          } catch (error) {
            controller.enqueue({
              type: 'error',
              error: extractErrorMessageOrDefault(
                error,
                'An unknown error occurred when transforming response chunk',
              ),
            });
          }
        } else {
          controller.enqueue({
            type: 'error',
            error: 'Chunk type is not supported',
          });
        }
      },
      flush: (controller) => {
        controller.enqueue({
          type: 'finish',
          finishReason: 'stop',
          usage: {
            completionTokens: 0,
            promptTokens: 0,
          },
        });
      },
    });
  }

  async doGenerate(
    options: LanguageModelV1CallOptions,
  ): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>> {
    const { accessToken, conversationId, projectId } =
      this.extractPatternProviderMetadataFromOptions(options);

    const lastMessage = this.getLastUserTextMessage(options);

    const messageResult = await sendMessage(
      accessToken,
      projectId,
      conversationId,
      lastMessage,
    );

    if (messageResult.isErr()) {
      throw new Error(messageResult.error);
    }

    const response = messageResult.value;
    return {
      text: response,
      usage: {
        promptTokens: 0,
        completionTokens: 0,
      },
      finishReason: 'stop',
      rawCall: {
        rawPrompt: options.prompt,
        rawSettings: {},
      },
    };
  }
  async doStream(
    options: LanguageModelV1CallOptions,
  ): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>> {
    const { accessToken, conversationId, projectId } =
      this.extractPatternProviderMetadataFromOptions(options);

    const lastMessage = this.getLastUserTextMessage(options);

    const streamResult = await sendMessageStreamed(
      accessToken,
      projectId,
      conversationId,
      lastMessage,
    );

    if (streamResult.isErr()) {
      throw new Error(streamResult.error);
    }

    const stream = streamResult.value;

    return {
      rawCall: {
        rawPrompt: options.prompt,
        rawSettings: {},
      },
      stream: stream.pipeThrough(this.getTransformStream()),
    };
  }
}
