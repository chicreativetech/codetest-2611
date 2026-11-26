import { Link } from 'react-router';
import type { ShowWithScore } from '../../api/tvmaze';
import styles from './SearchList.module.scss';
import { useEffect, useRef, useState } from 'react';

type SearchListProps = {
  results: ShowWithScore[];
};

const SearchList = ({ results }: SearchListProps) => {
  const resultListRef = useRef<HTMLDivElement>(null);
  const [resultListHeight, setResultListHeight] = useState(0);

  useEffect(() => {
    const element = resultListRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => setResultListHeight(element.offsetHeight));
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.viewport} style={{ height: resultListHeight }}>
      <div ref={resultListRef}>
        {results.length > 0 && (
          <ul className={styles.list}>
            {results.map(({ show }) => (
              <li key={show.id}>
                <Link to={`/shows/${show.id}`} className={styles.item}>
                  {show.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchList;
