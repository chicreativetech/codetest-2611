import { useEffect, useState } from 'react';
import { fetchTopShows, type ShowWithImage } from '../api/tvmaze';
import { useToast } from './useToast';

export const useTopShows = (limit = 5) => {
  const showToast = useToast();
  const [shows, setShows] = useState<ShowWithImage[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadShows = async () => {
      try {
        setShows(await fetchTopShows(limit, controller.signal, showToast));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to load top shows', error);
        }
      }
    };

    loadShows();

    return () => controller.abort();
  }, [limit, showToast]);

  return shows;
};
