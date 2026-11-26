import type { ShowWithImage } from '../../api/tvmaze';
import BackdropPoster from './BackdropPoster';
import styles from './ShowBackdrop.module.scss';

type ShowBackdropProps = {
  shows: ShowWithImage[];
};

const ShowBackdrop = ({ shows }: ShowBackdropProps) => (
  <div className={styles.backdrop} aria-hidden='true' data-testid='show-backdrop'>
    {shows.map((show) => (
      <BackdropPoster key={show.id} src={show.image.original} />
    ))}
  </div>
);

export default ShowBackdrop;
