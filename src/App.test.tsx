import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./hooks/useTopShows', () => ({ useTopShows: () => [] }));

describe('App', () => {
  afterEach(() => window.history.pushState({}, '', '/'));

  it('renders the landing page at the root route', () => {
    render(<App />);

    expect(screen.getByTestId('show-backdrop')).toBeInTheDocument();
  });

  it('redirects unknown routes to the landing page', () => {
    window.history.pushState({}, '', '/does-not-exist');
    render(<App />);

    expect(window.location.pathname).toBe('/');
    expect(screen.getByTestId('show-backdrop')).toBeInTheDocument();
  });
});
