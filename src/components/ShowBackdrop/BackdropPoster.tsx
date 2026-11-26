import { useImageLoaded } from '../../hooks/useImageLoaded';
import styles from './ShowBackdrop.module.scss';

type BackdropPosterProps = {
  src: string;
  onLoaded?: () => void;
};

const BackdropPoster = ({ src, onLoaded }: BackdropPosterProps) => {
  const isLoaded = useImageLoaded(src, onLoaded);
  const className = isLoaded ? `${styles.poster} ${styles.loaded}` : styles.poster;

  return <div className={className} style={{ backgroundImage: `url("${src}")` }} data-testid='backdrop-poster' />;
};

export default BackdropPoster;
