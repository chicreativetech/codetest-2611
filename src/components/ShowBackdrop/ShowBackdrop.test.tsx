import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ShowWithImage } from '../../api/tvmaze';
import ShowBackdrop from './ShowBackdrop';

const createShow = (id: number): ShowWithImage => ({
  id,
  name: `Show ${id}`,
  rating: { average: 8 },
  weight: 90,
  image: { medium: `medium-${id}.jpg`, original: `original-${id}.jpg` }
});

const preloadedImages: HTMLImageElement[] = [];

class MockImage {
  onload: (() => void) | null = null;
  src = '';

  constructor() {
    preloadedImages.push(this as unknown as HTMLImageElement);
  }
}

describe('ShowBackdrop', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    preloadedImages.length = 0;
  });

  it('renders a poster for every show as a background image', () => {
    render(<ShowBackdrop shows={[createShow(1), createShow(2)]} />);

    const posters = screen.getAllByTestId('backdrop-poster');

    expect(posters).toHaveLength(2);
    expect(posters[0].style.backgroundImage).toBe('url("original-1.jpg")');
  });

  it('marks a poster as loaded once its image has loaded', () => {
    vi.stubGlobal('Image', MockImage);
    render(<ShowBackdrop shows={[createShow(1)]} />);

    const poster = screen.getByTestId('backdrop-poster');
    expect(poster.className).not.toMatch(/loaded/);

    act(() => preloadedImages[0].onload?.(new Event('load')));

    expect(poster.className).toMatch(/loaded/);
  });

  it('is hidden from assistive technology', () => {
    render(<ShowBackdrop shows={[createShow(1)]} />);

    expect(screen.getByTestId('show-backdrop')).toHaveAttribute('aria-hidden', 'true');
  });
});
