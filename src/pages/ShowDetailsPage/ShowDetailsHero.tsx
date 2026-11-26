import type { ShowDetails } from '../../api/tvmaze';
import styles from './ShowDetailsPage.module.scss';

const formatYears = ({ premiered, ended, status }: ShowDetails) => {
  const start = premiered?.slice(0, 4);
  if (!start) return null;

  const end = status === 'Running' ? 'present' : ended?.slice(0, 4);
  return end && end !== start ? `${start} – ${end}` : start;
};

const formatRuntime = ({ runtime }: ShowDetails) => (runtime ? `${runtime} min` : null);
const formatChannel = ({ network, webChannel }: ShowDetails) => network?.name ?? webChannel?.name ?? null;
const summaryToText = ({ summary }: ShowDetails) =>
  summary ? (new DOMParser().parseFromString(summary, 'text/html').body.textContent ?? '') : '';

type ShowDetailsHeroProps = {
  show: ShowDetails;
};

const ShowDetailsHero = ({ show }: ShowDetailsHeroProps) => {
  const facts = [formatYears(show), formatChannel(show), formatRuntime(show), show.status].filter(Boolean);
  const rating = show.rating.average;

  return (
    <section className={styles.hero}>
      {show.image ? (
        <img className={styles.poster} src={show.image.original} alt={`${show.name} poster`} />
      ) : (
        <div className={styles.poster} />
      )}

      <div className={styles.info}>
        <h1 className={styles.title}>{show.name}</h1>

        <ul className={styles.facts}>
          {rating && (
            <li>
              <i className='bi bi-star-fill' aria-hidden='true' /> {rating}
            </li>
          )}
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>

        {show.genres.length > 0 && (
          <ul className={styles.genres}>
            {show.genres.map((genre) => (
              <li key={genre} className={styles.genre}>
                {genre}
              </li>
            ))}
          </ul>
        )}

        <p className={styles.summary}>{summaryToText(show)}</p>
      </div>
    </section>
  );
};

export default ShowDetailsHero;
