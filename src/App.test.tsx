import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { ToastProvider } from './context/ToastProvider';

vi.mock('./hooks/useTopShows', () => ({ useTopShows: () => [] }));

const breakingBad = { id: 169, name: 'Breaking Bad', rating: { average: 9.2 }, weight: 100, image: null };
const searchResults = [{ score: 1, show: breakingBad }];

describe('App', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
    vi.unstubAllGlobals();
  });

  it('renders the landing page at the root route', () => {
    render(<App />, { wrapper: ToastProvider });

    expect(screen.getByTestId('show-backdrop')).toBeInTheDocument();
  });

  it('redirects unknown routes to the landing page', () => {
    window.history.pushState({}, '', '/does-not-exist');
    render(<App />, { wrapper: ToastProvider });

    expect(window.location.pathname).toBe('/');
    expect(screen.getByTestId('show-backdrop')).toBeInTheDocument();
  });

  it('shows the TVmaze status in an error toast when a search fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })));
    render(<App />, { wrapper: ToastProvider });

    fireEvent.change(screen.getByPlaceholderText('Search show'), { target: { value: 'breaking' } });

    expect(await screen.findByRole('alert')).toHaveTextContent('TVmaze request failed with status 503');
  });

  it('opens the matching show details when a search result is selected', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json(searchResults))
      .mockResolvedValueOnce(Response.json({ ...breakingBad, genres: [], status: 'Ended', _embedded: { cast: [] } }));
    vi.stubGlobal('fetch', fetchMock);
    render(<App />, { wrapper: ToastProvider });

    await user.type(screen.getByRole('textbox'), 'breaking');
    await user.click(await screen.findByRole('link', { name: 'Breaking Bad' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Breaking Bad' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/shows/169');
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'https://api.tvmaze.com/search/shows?q=breaking',
      'https://api.tvmaze.com/shows/169?embed=cast'
    ]);
  });

  it('finds a show using the complete word when a partial title has no matches', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json([]))
      .mockResolvedValueOnce(Response.json(searchResults));
    vi.stubGlobal('fetch', fetchMock);
    render(<App />, { wrapper: ToastProvider });

    const input = screen.getByRole('textbox');
    await user.type(input, 'breaking ba');

    expect(await screen.findByRole('link', { name: 'Breaking Bad' })).toBeInTheDocument();
    expect(input).toHaveValue('breaking ba');
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'https://api.tvmaze.com/search/shows?q=breaking%20ba',
      'https://api.tvmaze.com/search/shows?q=breaking'
    ]);
  });
});
