import type { CastMember } from '../../api/tvmaze';
import styles from './CastList.module.scss';

type CastListProps = {
  cast: CastMember[];
};

const CastList = ({ cast }: CastListProps) => (
  <ul className={styles.list}>
    {cast.map(({ person, character }) => (
      <li key={`${person.id}-${character.id}`} className={styles.member}>
        {person.image ? (
          <img className={styles.photo} src={person.image.medium} alt='' loading='lazy' />
        ) : (
          <div className={styles.photo}>
            <i className='bi bi-person' aria-hidden='true' />
          </div>
        )}
        <p className={styles.name}>{person.name}</p>
        <p className={styles.character}>{character.name}</p>
      </li>
    ))}
  </ul>
);

export default CastList;
