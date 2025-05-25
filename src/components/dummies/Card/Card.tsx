import { cc } from 'utils/combineClasses';
import styles from './styles.module.scss';

interface Props {
  image?: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
  className?: string;
}

const Card = ({ image, title, subtitle, children, className }: Props) => {
  return (
    <div className={cc(styles.cardRoot, className)}>
      {image ? (
        <img src={image} className={styles.avatar} onError={(e) => (e.currentTarget.style.display = 'none')} />
      ) : (
        <div className={styles.avatarFallback}>
          {title.charAt(0).toUpperCase()}
        </div>
      )}
      <div className={styles.cardInfo}>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <div className={styles.cardChildren}>{children}</div>
      </div>
    </div>
  );
};

export default Card;
