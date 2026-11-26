import { useEffect, useState } from 'react';
import { fetchShowDetails, type ShowDetails } from '../api/tvmaze';
import { useToast } from './useToast';

export type ShowDetailsState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; show: ShowDetails };

type Result = { id: number; state: ShowDetailsState };

export const useShowDetails = (id: number): ShowDetailsState => {
  const showToast = useToast();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    const loadShow = async () => {
      try {
        setResult({ id, state: { status: 'ready', show: await fetchShowDetails(id, controller.signal, showToast) } });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Failed to load show details', error);
        setResult({ id, state: { status: 'error' } });
      }
    };

    loadShow();
    return () => controller.abort();
  }, [id, showToast]);

  return result?.id === id ? result.state : { status: 'loading' };
};
