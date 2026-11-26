import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import LandingPage from './LandingPage';

vi.mock('../../hooks/useTopShows', () => ({ useTopShows: () => [] }));
vi.mock('../../hooks/useShowSearch', () => ({
  useShowSearch: () => ({
    searchResults: [
      { score: 1, show: { id: 1, name: 'Breaking Bad' } },
      { score: 1, show: { id: 2, name: 'Better Call Saul' } }
    ],
    isSearching: false
  })
}));

const renderLandingPage = () =>
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );

describe('LandingPage', () => {
  it('renders the main landmark', () => {
    renderLandingPage();

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the show backdrop', () => {
    renderLandingPage();

    expect(screen.getByTestId('show-backdrop')).toBeInTheDocument();
  });

  it('moves focus between the input and results with the arrow keys', () => {
    renderLandingPage();
    const input = screen.getByPlaceholderText('Search show');
    const [first, second] = screen.getAllByRole('link');

    input.focus();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(second).toHaveFocus();

    fireEvent.keyDown(second, { key: 'ArrowDown' });
    expect(second).toHaveFocus();

    fireEvent.keyDown(second, { key: 'ArrowUp' });
    fireEvent.keyDown(first, { key: 'ArrowUp' });
    expect(input).toHaveFocus();
  });
});
