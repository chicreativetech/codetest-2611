import { useEffect, useState } from 'react';
import { fetchTopShows, type ShowWithImage } from '../api/tvmaze';

export const useTopShows = (limit = 5) => {
  const [shows, setShows] = useState<ShowWithImage[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadShows = async () => {
      try {
        setShows(await fetchTopShows(limit, controller.signal));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to load top shows', error);
        }
      }
    };

    loadShows();

    return () => controller.abort();
  }, [limit]);

  return shows;
};
