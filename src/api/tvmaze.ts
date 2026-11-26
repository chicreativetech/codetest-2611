const API_URL = 'https://api.tvmaze.com';

export type Show = {
  id: number;
  name: string;
  rating: { average: number | null };
  weight: number;
  image: { medium: string; original: string } | null;
};

export type ShowWithImage = Show & { image: NonNullable<Show['image']> };

const hasImage = (show: Show): show is ShowWithImage => show.image !== null;
const byRatingDescending = (a: Show, b: Show) => (b.rating.average ?? 0) - (a.rating.average ?? 0);

// Fetches the top shows with images and sorts them by rating. This is used for the background images on the landing page.
export async function fetchTopShows(limit: number, signal?: AbortSignal): Promise<ShowWithImage[]> {
  const response = await fetch(`${API_URL}/shows?page=0`, { signal });

  if (!response.ok) {
    throw new Error(`TVmaze request failed with status ${response.status}`);
  }

  const shows: Show[] = await response.json();

  return shows.filter(hasImage).sort(byRatingDescending).slice(0, limit);
}
