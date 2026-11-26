import { useEffect, useRef, useState } from 'react';

/**
 * Preloads an image and reports when it has finished loading.
 * Useful for images rendered via CSS (e.g. background-image), which expose no load event.
 */
export const useImageLoaded = (src: string, onLoaded?: () => void) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const onLoadedRef = useRef(onLoaded);

  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  useEffect(() => {
    const image = new Image();

    image.onload = () => {
      setLoadedSrc(src);
      onLoadedRef.current?.();
    };
    image.src = src;

    return () => {
      image.onload = null;
    };
  }, [src]);

  return loadedSrc === src;
};
