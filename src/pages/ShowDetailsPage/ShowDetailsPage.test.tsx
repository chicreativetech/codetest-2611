import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ShowDetails } from '../../api/tvmaze';
import type { ShowDetailsState } from '../../hooks/useShowDetails';
import ShowDetailsPage from './ShowDetailsPage';

const mockState = vi.hoisted(() => ({ current: { status: 'loading' } as ShowDetailsState }));
vi.mock('../../hooks/useShowDetails', () => ({ useShowDetails: () => mockState.current }));

const show = {
  id: 169,
  name: 'Breaking Bad',
  rating: { average: 9.2 },
  weight: 100,
  image: null,
  genres: ['Drama', 'Crime'],
  summary: '<p><b>Breaking Bad</b> follows Walter White.</p>',
  status: 'Ended',
  premiered: '2008-01-20',
  ended: '2013-09-29',
  runtime: 60,
  network: { name: 'AMC' },
  webChannel: null,
  _embedded: {
    cast: [{ person: { id: 1, name: 'Bryan Cranston', image: null }, character: { id: 2, name: 'Walter White' } }]
  }
} satisfies ShowDetails;

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/shows/169']}>
      <Routes>
        <Route path='shows/:id' element={<ShowDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );

describe('ShowDetailsPage', () => {
  beforeEach(() => {
    mockState.current = { status: 'loading' };
  });

  it('shows a loading message', () => {
    renderPage();

    expect(screen.getByText('Loading show…')).toBeInTheDocument();
  });

  it('shows an error message', () => {
    mockState.current = { status: 'error' };
    renderPage();

    expect(screen.getByText('We couldn’t load this show.')).toBeInTheDocument();
  });

  it('renders the show details and cast', () => {
    mockState.current = { status: 'ready', show };
    renderPage();

    expect(screen.getByRole('heading', { name: 'Breaking Bad' })).toBeInTheDocument();
    expect(screen.getByText('2008 – 2013')).toBeInTheDocument();
    expect(screen.getByText('AMC')).toBeInTheDocument();
    expect(screen.getByText('Breaking Bad follows Walter White.')).toBeInTheDocument();
    expect(screen.getByText('Bryan Cranston')).toBeInTheDocument();
    expect(screen.getByText('Walter White')).toBeInTheDocument();
  });

  it('links back to the search', () => {
    renderPage();

    expect(screen.getByRole('link', { name: 'Back to search' })).toHaveAttribute('href', '/');
  });
});
