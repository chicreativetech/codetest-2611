import { Link, useParams } from 'react-router';
import CastList from '../../components/CastList/CastList';
import { useShowDetails } from '../../hooks/useShowDetails';
import ShowDetailsHero from './ShowDetailsHero';
import styles from './ShowDetailsPage.module.scss';

const ShowDetailsPage = () => {
  const { id } = useParams();
  const state = useShowDetails(Number(id));

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link to='/' className={styles.back}>
          <i className='bi bi-arrow-left' aria-hidden='true' />
          Back to search
        </Link>

        {state.status === 'loading' && <p className={styles.message}>Loading show…</p>}
        {state.status === 'error' && <p className={styles.message}>We couldn’t load this show.</p>}
        {state.status === 'ready' && (
          <>
            <ShowDetailsHero show={state.show} />
            {state.show._embedded.cast.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.heading}>Cast</h2>
                <CastList cast={state.show._embedded.cast} />
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default ShowDetailsPage;
