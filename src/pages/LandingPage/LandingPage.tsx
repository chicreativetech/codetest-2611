import { useState } from 'react';
import SearchList from '../../components/SearchList/SearchList';
import ShowBackdrop from '../../components/ShowBackdrop/ShowBackdrop';
import { useTopShows } from '../../hooks/useTopShows';
import styles from './LandingPage.module.scss';
import { useArrowKeyNavigation } from '../../hooks/useArrowKeyNavigation';
import { useShowSearch } from '../../hooks/useShowSearch';

const LandingPage = () => {
  const [searchString, setSearchString] = useState('');
  const { searchResults } = useShowSearch(searchString);
  const topShows = useTopShows();
  const { onKeyDown } = useArrowKeyNavigation();

  return (
    <div className={styles.page}>
      <ShowBackdrop shows={topShows} />
      <main className={styles.main}>
        <div className={styles.mainContent}>
          <div className={styles.search} onKeyDown={onKeyDown}>
            <input
              placeholder='Search show'
              value={searchString}
              onChange={(event) => setSearchString(event.target.value)}
            />
            <SearchList results={searchResults} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
