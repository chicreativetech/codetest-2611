import { useEffect, useState } from 'react';
import { fetchSearchResults, type ShowWithScore } from '../api/tvmaze';
import { useToast, type ShowToast } from './useToast';

const MIN_QUERY_LENGTH = 3;
const QUERY_DELAY = 500;

const dropLastWord = (query: string) => query.split(/\s+/).slice(0, -1).join(' ');

// TVmaze only matches whole words, so a half-typed last word ("breaking ba") returns nothing.
// In that case, fall back to searching without the unfinished word.
const searchShows = async (query: string, signal: AbortSignal, showToast: ShowToast) => {
  const results = await fetchSearchResults(query, signal, showToast);
  const shorterQuery = dropLastWord(query);

  if (results.length > 0 || shorterQuery.length < MIN_QUERY_LENGTH) return results;

  return fetchSearchResults(shorterQuery, signal, showToast);
};

export const useShowSearch = (query: string) => {
  const showToast = useToast();
  const trimmedQuery = query.trim();
  const [searchResults, setSearchResults] = useState<ShowWithScore[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(trimmedQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedQuery(trimmedQuery), QUERY_DELAY);
    return () => clearTimeout(timeoutId);
  }, [trimmedQuery]);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();

    const search = async () => {
      setIsSearching(true);
      try {
        setSearchResults(await searchShows(debouncedQuery, controller.signal, showToast));
      } catch {
        if (!controller.signal.aborted) setSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    };

    search();
    return () => controller.abort();
  }, [debouncedQuery, showToast]);

  return { searchResults, isSearching };
};
