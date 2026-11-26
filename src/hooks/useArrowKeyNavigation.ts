import type { KeyboardEvent } from 'react';

const FOCUSABLE_SELECTOR = 'input, a[href]';

export const useArrowKeyNavigation = () => {
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    let nextItem;
    if (event.key == 'ArrowDown') {
      nextItem = items[currentIndex + 1];
    }
    if (event.key == 'ArrowUp') {
      nextItem = items[currentIndex - 1];
    }

    if (!nextItem) return;

    event.preventDefault();
    nextItem.focus();
  };

  return { onKeyDown };
};
