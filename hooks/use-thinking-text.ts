import { useState, useEffect } from 'react';

/**
 * A custom hook that returns a thinking text that changes every few seconds
 * with an exponentially increasing interval.
 * @param base - The base of the exponential function
 * @returns The current thinking text
 */
export const useThinkingText = (base = 3) => {
  const texts = [
    'Thinking...',
    'Calling relevant tools...',
    'Fetching external data...',
    'Finalizing response...',
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    texts.slice(0, -1).map((_, textIndex) => {
      setTimeout(
        () => {
          setIndex(textIndex + 1);
        },
        1000 * 3 ** (textIndex + 1),
      );
    });
  }, []);

  return texts[index];
};
