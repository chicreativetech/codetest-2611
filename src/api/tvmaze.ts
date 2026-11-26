import type { ShowToast } from '../hooks/useToast';

const API_URL = 'https://api.tvmaze.com';

async function fetchJson<T>(path: string, signal?: AbortSignal, showToast?: ShowToast): Promise<T> {
  let message = 'Couldn’t load data from TVmaze. Please try again.';
  try {
    const response = await fetch(`${API_URL}${path}`, { signal });
    if (!response.ok) {
      message = `TVmaze request failed with status ${response.status}`;
      throw new Error(message);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (!signal?.aborted && navigator.onLine) showToast?.(message, 'error');
    throw error;
  }
}

export type Show = {
  id: number;
  name: string;
  rating: { average: number | null };
  weight: number;
  image: { medium: string; original: string } | null;
};

export type ShowWithScore = {
  score: number;
  show: Show;
};

export type ShowWithImage = Show & { image: NonNullable<Show['image']> };

const hasShowImage = (show: Show): show is ShowWithImage => show.image !== null;
const byRatingDescending = (a: Show, b: Show) => (b.rating.average ?? 0) - (a.rating.average ?? 0);

// Fetches the top shows with images and sorts them by rating. This is used for the background images on the landing page.
export async function fetchTopShows(
  limit: number,
  signal?: AbortSignal,
  showToast?: ShowToast
): Promise<ShowWithImage[]> {
  const shows = await fetchJson<Show[]>('/shows?page=0', signal, showToast);

  return shows.filter(hasShowImage).sort(byRatingDescending).slice(0, limit);
}

// Fetches search result based on query
export function fetchSearchResults(
  query: string,
  signal?: AbortSignal,
  showToast?: ShowToast
): Promise<ShowWithScore[]> {
  return fetchJson(`/search/shows?q=${encodeURIComponent(query)}`, signal, showToast);
}

export type CastMember = {
  person: { id: number; name: string; image: Show['image'] };
  character: { id: number; name: string };
};

export type ShowDetails = Show & {
  genres: string[];
  summary: string | null;
  status: string;
  premiered: string | null;
  ended: string | null;
  runtime: number | null;
  network: { name: string } | null;
  webChannel: { name: string } | null;
  _embedded: { cast: CastMember[] };
};

// Fetches a  show together with cast data
export function fetchShowDetails(id: number, signal?: AbortSignal, showToast?: ShowToast): Promise<ShowDetails> {
  return fetchJson(`/shows/${id}?embed=cast`, signal, showToast);
}
