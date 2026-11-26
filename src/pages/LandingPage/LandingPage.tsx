import { useState } from 'react';
import ShowBackdrop from '../../components/ShowBackdrop/ShowBackdrop';
import { useTopShows } from '../../hooks/useTopShows';
import styles from './LandingPage.module.scss';

const LandingPage = () => {
  const [searchString, setSearchString] = useState('');
  const topShows = useTopShows();

  return (
    <div className={styles.page}>
      <ShowBackdrop shows={topShows} />
      <main className={styles.main}>
        <div className={styles.mainContent}>
          <div className={styles.search}>
            <input
              placeholder='Search show'
              value={searchString}
              onChange={(event) => setSearchString(event.target.value)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
