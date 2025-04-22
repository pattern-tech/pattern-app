import { edgeConfigAdapter } from '@flags-sdk/edge-config';
import { flag } from 'flags/next';

/**
 * @example
 * export const someFlag = flag({
 *   adapter: edgeConfigAdapter(),
 *   key: 'some-flag',
 * });
 */

/**
 * Feature flag to control whether to show tool calls in the chat UI
 */
type ShowToolCalls = 'console' | undefined;
export const showToolCalls = flag<ShowToolCalls>({
  adapter: edgeConfigAdapter(),
  key: 'show-tool-calls',
  options: ['console'],
  defaultValue: undefined,
});
