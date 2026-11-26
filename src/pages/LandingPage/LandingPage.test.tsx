import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LandingPage from './LandingPage';

vi.mock('../../hooks/useTopShows', () => ({ useTopShows: () => [] }));

describe('LandingPage', () => {
  it('renders the main landmark', () => {
    render(<LandingPage />);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the show backdrop', () => {
    render(<LandingPage />);

    expect(screen.getByTestId('show-backdrop')).toBeInTheDocument();
  });
});
